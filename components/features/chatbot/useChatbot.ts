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

export function useChatbot(options: UseChatbotOptions = {}): UseChatbotReturn {
  const {
    apiEndpoint = '/api/chatbot',
    welcomeMessage = '', // Disabled welcome message to prevent ordering issues
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

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isInitialized = useRef(false)

  // Initialize with welcome message
  useEffect(() => {
    if (!isInitialized.current && welcomeMessage) {
      const welcomeMsg: ChatMessage = {
        id: `welcome-${Date.now()}`,
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

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [state.messages])

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
        status: 'sending',
      }

      // Add user message
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
      }))

      // Mark user message as sent
      setState((prev) => ({
        ...prev,
        messages: prev.messages.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg
        ),
        isTyping: true,
        isStreaming: true,
      }))

      // Check if streaming is enabled
      const streamingEnabled = process.env.NEXT_PUBLIC_CHATBOT_STREAMING_ENABLED === 'true'

      try {
        if (streamingEnabled) {
          // Use streaming API
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
                // Update the assistant message in real-time
                setState((prev) => {
                  const existingAssistantMsg = prev.messages.find(
                    (msg) => msg.role === 'assistant' && msg.id.startsWith('assistant-streaming')
                  )

                  if (existingAssistantMsg) {
                    // Update existing message
                    return {
                      ...prev,
                      messages: prev.messages.map((msg) =>
                        msg.id === existingAssistantMsg.id
                          ? { ...msg, content: streamedAnswer }
                          : msg
                      ),
                    }
                  } else {
                    // Create new streaming message
                    return {
                      ...prev,
                      messages: [
                        ...prev.messages,
                        {
                          id: 'assistant-streaming-' + Date.now(),
                          role: 'assistant' as const,
                          content: streamedAnswer,
                          timestamp: new Date(),
                          status: 'sent' as const,
                        },
                      ],
                    }
                  }
                })
              },
              onSources: (payload) => {
                setState((prev) => ({
                  ...prev,
                  sources: payload.sources,
                  confidence: payload.confidence,
                }))
              },
              onDone: (payload) => {
                setState((prev) => ({
                  ...prev,
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
          // Use normal API
          const response = await sendChatMessage({
            message: content,
            session_id: getOrCreateChatSessionId(),
            filters: null,
            top_k: 5,
          })

          // Add assistant response
          const assistantMessage: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: response.answer,
            timestamp: new Date(),
            status: 'sent',
          }

          setState((prev) => ({
            ...prev,
            messages: [...prev.messages, assistantMessage],
            sources: response.sources,
            confidence: response.confidence,
            isTyping: false,
            isStreaming: false,
            hasUnread: !prev.isOpen,
          }))
        }
      } catch (error) {
        console.error('Chatbot API error:', error)

        // Mark user message as error
        setState((prev) => ({
          ...prev,
          messages: prev.messages.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: 'error' as const } : msg
          ),
          isTyping: false,
          isStreaming: false,
        }))

        // Add error message
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again later.',
          timestamp: new Date(),
          status: 'sent',
        }

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
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
      messages: welcomeMessage
        ? [
            {
              id: `welcome-${Date.now()}`,
              role: 'assistant',
              content: welcomeMessage,
              timestamp: new Date(),
              status: 'sent',
            },
          ]
        : [],
    }))
  }, [welcomeMessage])

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
