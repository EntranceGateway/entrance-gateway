'use client'

import { useEffect, useState } from 'react'
import type { ChatMessage } from './types'

interface ChatbotMessageProps {
  message: ChatMessage
}

export function ChatbotMessage({ message }: ChatbotMessageProps) {
  const [isVisible, setIsVisible] = useState(false)
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  }

  return (
    <div
      className={`
        flex gap-2 mb-4 transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        ${isUser ? 'flex-row-reverse' : 'flex-row'}
      `}
    >
      {/* Avatar */}
      {isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-brand-navy font-bold text-xs shadow-sm">
          AI
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
        {/* Message Bubble */}
        <div
          className={`
            px-4 py-2.5 rounded-2xl shadow-sm
            ${
              isUser
                ? 'bg-brand-blue text-white rounded-br-md'
                : 'bg-gray-100 text-gray-900 rounded-bl-md'
            }
            ${message.status === 'error' ? 'border-2 border-error' : ''}
          `}
        >
          {/* Message Text */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {/* Status Indicator for User Messages */}
          {isUser && message.status === 'sending' && (
            <div className="flex items-center gap-1 mt-1 text-xs text-white/70">
              <div className="flex gap-0.5">
                <span className="w-1 h-1 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>Sending...</span>
            </div>
          )}

          {message.status === 'error' && (
            <div className="flex items-center gap-1 mt-1 text-xs text-error">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
              </svg>
              <span>Failed to send</span>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-500 mt-1 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>

      {/* User Avatar Placeholder */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-xs shadow-sm">
          U
        </div>
      )}
    </div>
  )
}

// Typing Indicator Component
export function TypingIndicator() {
  return (
    <div className="flex gap-2 mb-4">
      {/* Bot Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-brand-navy font-bold text-xs shadow-sm">
        AI
      </div>

      {/* Typing Animation */}
      <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
