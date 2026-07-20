'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { ChatMessage, ChatbotState, ChatSource } from './types'
import { sendChatMessage, streamChatMessage } from '@/services/client/chatbot.client'
import { getOrCreateChatSessionId } from '@/lib/chatbot/session'

interface UseChatbotOptions {
  apiEndpoint?: string
  welcomeMessage?: string
  onError?: (error: Error) => void
}

interface UseChatbotReturn extends ChatbotState {
  sendMessage: (content: string) => Promise<void>
  toggleOpen: () => void
  closeChat: () => void
  openChat: () => void
  clearMessages: () => void
  markAsRead: () => void
}

// Counter for generating stable, unique IDs within a session
let messageIdCounter = 0
function nextId(prefix: string): string {
  messageIdCounter += 1
  return `${prefix}-${messageIdCounter}-${Date.now()}`
}

export function useChatbot(options: UseChatbotOptions = {}): UseChatbotReturn {
  const {
    welcomeMessage = '',
    onError,
  } = options

  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    isMinimized: false,
    messages: [],
    isTyping: false,
    hasUnread: false,
    sources: [],
    confidence: 0,
    isStreaming: false,
  })

  const isInitialized = useRef(false)

  // Initialize with welcome message (only once)
  useEffect(() => {
    if (!isInitialized.current && welcomeMessage) {
      const welcomeMsg: ChatMessage = {
        id: nextId('welcome'),
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date(),
        status: 'sent',
      }
      setState((prev) => ({
        ...prev,
        messages: [welcomeMsg],
      }))
      isInitialized.current = true
    }
  }, [welcomeMessage])

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (state.isOpen && state.hasUnread) {
      setState((prev) => ({ ...prev, hasUnread: false }))
    }
  }, [state.isOpen, state.hasUnread])

  const sendMessage = useCallback(
    async (content: string) => {
      // Generate stable IDs upfront — these never change during the request
      const userMsgId = nextId('user')
      const assistantMsgId = nextId('assistant')

      const userMessage: ChatMessage = {
        id: userMsgId,
        role: 'user',
        content,
        timestamp: new Date(),
        status: 'sent',
      }

      const assistantPlaceholder: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        status: 'sending',
      }

      // CRITICAL: Single atomic setState adds BOTH user message AND assistant
      // placeholder at once. This guarantees:
      //   1. User message is always before assistant message
      //   2. No race condition between separate setStates
      //   3. Streaming tokens always find their target message
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage, assistantPlaceholder],
        isTyping: true,
        isStreaming: true,
      }))

      const streamingEnabled = process.env.NEXT_PUBLIC_CHATBOT_STREAMING_ENABLED === 'true'

      try {
        if (streamingEnabled) {
          // ── Streaming path ──────────────────────────────────────
          let streamedAnswer = ''

          await streamChatMessage(
            {
              message: content,
              session_id: getOrCreateChatSessionId(),
              filters: null,
              top_k: 5,
            },
            {
              onToken: (token) => {
                streamedAnswer += token
                // Update the assistant placeholder — always found by stable ID
                setState((prev) => ({
                  ...prev,
                  isTyping: false, // Hide typing dots once real content arrives
                  messages: prev.messages.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, content: streamedAnswer, status: 'sent' as const }
                      : msg
                  ),
                }))
              },
              onSources: (payload) => {
                setState((prev) => ({
                  ...prev,
                  sources: payload.sources,
                  confidence: payload.confidence,
                }))
              },
              onDone: (payload) => {
                // The backend validates the answer only AFTER generation
                // finishes: citations are checked, and an ungrounded or
                // mis-cited answer is replaced with the refusal message. The
                // streamed tokens are therefore provisional — `payload.answer`
                // is the authoritative, guardrail-approved text and must
                // overwrite whatever was streamed, or rejected output stays on
                // screen.
                const finalAnswer = payload?.answer ?? streamedAnswer
                setState((prev) => ({
                  ...prev,
                  messages: prev.messages.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, content: finalAnswer, status: 'sent' as const }
                      : msg
                  ),
                  confidence: payload?.confidence ?? prev.confidence,
                  isTyping: false,
                  isStreaming: false,
                  hasUnread: !prev.isOpen,
                }))
              },
              onError: (message) => {
                throw new Error(message)
              },
            }
          )
        } else {
          // ── Normal (non-streaming) path ─────────────────────────
          const response = await sendChatMessage({
            message: content,
            session_id: getOrCreateChatSessionId(),
            filters: null,
            top_k: 5,
          })

          // Update the assistant placeholder with the full response
          setState((prev) => ({
            ...prev,
            messages: prev.messages.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: response.answer, status: 'sent' as const }
                : msg
            ),
            sources: response.sources,
            confidence: response.confidence,
            isTyping: false,
            isStreaming: false,
            hasUnread: !prev.isOpen,
          }))
        }
      } catch (error) {
        console.error('Chatbot API error:', error)

        const errorContent =
          error instanceof Error
            ? error.message
            : 'Sorry, I encountered an error. Please try again later.'

        // Update the assistant placeholder with the error message
        setState((prev) => ({
          ...prev,
          messages: prev.messages.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, content: errorContent, status: 'error' as const }
              : msg
          ),
          isTyping: false,
          isStreaming: false,
        }))

        if (onError && error instanceof Error) {
          onError(error)
        }
      }
    },
    [state.isOpen, onError]
  )

  const toggleOpen = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
      hasUnread: prev.isOpen ? prev.hasUnread : false,
    }))
  }, [])

  const closeChat = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const openChat = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true, hasUnread: false }))
  }, [])

  const clearMessages = useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: [],
      sources: [],
      confidence: 0,
    }))
  }, [])

  const markAsRead = useCallback(() => {
    setState((prev) => ({ ...prev, hasUnread: false }))
  }, [])

  return {
    ...state,
    sendMessage,
    toggleOpen,
    closeChat,
    openChat,
    clearMessages,
    markAsRead,
  }
}
