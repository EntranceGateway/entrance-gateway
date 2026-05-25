/**
 * Chatbot API Client
 * 
 * Handles communication with the RAG chatbot backend API
 * Supports both normal request/response and streaming chat
 */

import type {
  ChatRequest,
  ChatResponse,
  ChatSource,
  StreamHandlers,
  StreamSourcesData,
  StreamDoneData,
} from '@/components/features/chatbot/types'
import { getOrCreateChatSessionId } from '@/lib/chatbot/session'

// Get API base URL from environment
const CHATBOT_API_BASE_URL = process.env.NEXT_PUBLIC_CHATBOT_API_BASE_URL || 'http://185.177.116.173:8002/api/v1'

/**
 * Send a normal (non-streaming) chat message
 * 
 * @param request Chat request payload
 * @returns Chat response with answer and sources
 * @throws Error if request fails
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const url = `${CHATBOT_API_BASE_URL}/chat`

  // Ensure session_id is set
  const payload: ChatRequest = {
    session_id: getOrCreateChatSessionId(),
    filters: null,
    top_k: 5,
    ...request,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(handleErrorStatus(response.status, errorText))
    }

    const data: ChatResponse = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to send chat message. Please try again.')
  }
}

/**
 * Send a streaming chat message with Server-Sent Events
 * 
 * @param request Chat request payload
 * @param handlers Event handlers for streaming events
 * @param signal Optional AbortSignal for cancellation
 * @throws Error if request fails
 */
export async function streamChatMessage(
  request: ChatRequest,
  handlers: StreamHandlers,
  signal?: AbortSignal
): Promise<void> {
  const url = `${CHATBOT_API_BASE_URL}/chat/stream`

  // Ensure session_id is set
  const payload: ChatRequest = {
    session_id: getOrCreateChatSessionId(),
    filters: null,
    top_k: 5,
    ...request,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal,
    })

    if (!response.ok || !response.body) {
      const errorText = await response.text()
      throw new Error(handleErrorStatus(response.status, errorText))
    }

    // Parse SSE stream
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      
      if (done) {
        break
      }

      // Decode chunk and add to buffer
      buffer += decoder.decode(value, { stream: true })

      // Split by double newline (SSE event separator)
      const events = buffer.split('\n\n')
      
      // Keep the last incomplete event in buffer
      buffer = events.pop() ?? ''

      // Process complete events
      for (const rawEvent of events) {
        if (rawEvent.trim()) {
          handleSseEvent(rawEvent, handlers)
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        // User cancelled - don't treat as error
        return
      }
      handlers.onError(error.message)
    } else {
      handlers.onError('Failed to stream chat message. Please try again.')
    }
  }
}

/**
 * Parse and handle a single SSE event
 * 
 * @param rawEvent Raw SSE event string
 * @param handlers Event handlers
 */
function handleSseEvent(rawEvent: string, handlers: StreamHandlers): void {
  const lines = rawEvent.split('\n')
  
  // Extract event type and data
  const eventLine = lines.find((line) => line.startsWith('event: '))
  const dataLine = lines.find((line) => line.startsWith('data: '))

  if (!eventLine || !dataLine) {
    return
  }

  const event = eventLine.replace('event: ', '').trim()
  const dataStr = dataLine.replace('data: ', '').trim()

  try {
    const data = JSON.parse(dataStr)

    switch (event) {
      case 'heartbeat':
        handlers.onHeartbeat?.()
        break

      case 'token':
        if (data.token) {
          handlers.onToken(data.token)
        }
        break

      case 'sources':
        handlers.onSources(data as StreamSourcesData)
        break

      case 'done':
        handlers.onDone(data as StreamDoneData)
        break

      case 'error':
        handlers.onError(data.message ?? 'Streaming error occurred')
        break

      default:
        console.warn('Unknown SSE event type:', event)
    }
  } catch (error) {
    console.error('Failed to parse SSE event data:', error)
  }
}

/**
 * Convert HTTP status codes to user-friendly error messages
 * 
 * @param status HTTP status code
 * @param errorText Raw error text from response
 * @returns User-friendly error message
 */
function handleErrorStatus(status: number, errorText: string): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please try rephrasing your question.'
    
    case 401:
      return 'Authentication error. Please refresh the page and try again.'
    
    case 422:
      return 'I didn\'t understand that question. Could you rephrase it?'
    
    case 429:
      return 'You\'re asking too many questions. Please wait a moment and try again.'
    
    case 500:
      return 'I\'m having trouble thinking right now. Please try again in a moment.'
    
    case 503:
      return 'The chatbot service is temporarily unavailable. Please try again later.'
    
    default:
      // Try to extract meaningful error from response
      if (errorText && errorText.length < 200) {
        return errorText
      }
      return 'Something went wrong. Please try again.'
  }
}

/**
 * Check if the chatbot backend is healthy
 * 
 * @returns True if healthy, false otherwise
 */
export async function checkChatbotHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${CHATBOT_API_BASE_URL}/health`, {
      method: 'GET',
    })
    return response.ok
  } catch (error) {
    return false
  }
}
