'use client'

import { useRef, useEffect } from 'react'
import { ChatbotHeader } from './ChatbotHeader'
import { ChatbotMessage, TypingIndicator } from './ChatbotMessage'
import { ChatbotInput } from './ChatbotInput'
import { ChatbotSourceList } from './ChatbotSourceList'
import type { ChatMessage, ChatSource } from './types'

interface ChatbotWindowProps {
  isOpen: boolean
  messages: ChatMessage[]
  isTyping: boolean
  sources?: ChatSource[]
  botName?: string
  botAvatar?: string
  placeholder?: string
  onSend: (message: string) => void
  onClose: () => void
  onMinimize?: () => void
  onNewChat?: () => void
}

export function ChatbotWindow({
  isOpen,
  messages,
  isTyping,
  sources = [],
  botName = 'AI Assistant',
  botAvatar = 'AI',
  placeholder = 'Type your message...',
  onSend,
  onClose,
  onMinimize,
  onNewChat,
}: ChatbotWindowProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive or during streaming
  useEffect(() => {
    const container = messagesContainerRef.current
    if (container && isOpen) {
      // Use scrollTop for immediate, reliable scroll during streaming
      container.scrollTop = container.scrollHeight
    }
  }, [messages, isTyping, isOpen])

  return (
    <div
      className={`
        fixed bottom-24 right-6 z-40
        w-[380px] max-w-[calc(100vw-3rem)]
        h-[600px] max-h-[calc(100vh-8rem)]
        flex flex-col
        bg-white rounded-2xl shadow-2xl
        transition-all duration-300 ease-out
        ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }
      `}
      style={{
        transformOrigin: 'bottom right',
      }}
    >
      {/* Header */}
      <ChatbotHeader
        botName={botName}
        botAvatar={botAvatar}
        isOnline={true}
        onMinimize={onMinimize}
        onClose={onClose}
        onNewChat={onNewChat}
      />

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 #F7FAFC',
        }}
      >
        {/* Messages — rendered in array order, which is chronological */}
        {messages.map((message) => {
          // Skip rendering the assistant placeholder if it has no content yet
          // (the TypingIndicator below handles that visual state)
          if (message.role === 'assistant' && message.status === 'sending' && !message.content) {
            return null
          }
          return <ChatbotMessage key={message.id} message={message} />
        })}

        {/* Typing Indicator — only shown when waiting for first token */}
        {isTyping && <TypingIndicator />}

        {/* Empty State */}
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-16 h-16 rounded-full bg-brand-gold/20 flex items-center justify-center mb-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-8 h-8 text-brand-navy"
              >
                <path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M8 10h.01M12 10h.01M16 10h.01" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a conversation</h3>
            <p className="text-sm text-gray-600">
              Ask me anything about courses, admissions, or exam preparation!
            </p>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatbotInput onSend={onSend} disabled={isTyping} placeholder={placeholder} />

      {/* Sources - Hidden for now */}
      {/* {sources.length > 0 && <ChatbotSourceList sources={sources} />} */}

      {/* Glassmorphism overlay effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    </div>
  )
}
