'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'

interface ChatbotInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatbotInput({
  onSend,
  disabled = false,
  placeholder = 'Type your message...',
}: ChatbotInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage)
      setMessage('')
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4 rounded-b-2xl">
      {/* Input Container */}
      <div className="flex items-end gap-2">
        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={`
              w-full px-4 py-2.5 pr-10
              bg-gray-50 border border-gray-200 rounded-xl
              text-sm text-gray-900 placeholder-gray-500
              resize-none overflow-y-auto
              focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent
              transition-all duration-200
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            style={{ maxHeight: '120px' }}
          />

          {/* Character Count (optional) */}
          {message.length > 0 && (
            <span className="absolute bottom-2 right-2 text-xs text-gray-400">
              {message.length}
            </span>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          aria-label="Send message"
          className={`
            flex-shrink-0 w-10 h-10 rounded-xl
            flex items-center justify-center
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2
            ${
              disabled || !message.trim()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-brand-blue text-white hover:bg-brand-navy hover:shadow-md active:scale-95'
            }
          `}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>

      {/* Keyboard Hint */}
      <div className="mt-2 text-xs text-gray-400 text-center">
        Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-600 font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-600 font-mono">Shift + Enter</kbd> for new line
      </div>
    </div>
  )
}
