'use client'

import { useState, useEffect } from 'react'

interface ChatbotLauncherProps {
  isOpen: boolean
  hasUnread: boolean
  onClick: () => void
}

export function ChatbotLauncher({ isOpen, hasUnread, onClick }: ChatbotLauncherProps) {
  const [isPulsing, setIsPulsing] = useState(false)

  useEffect(() => {
    if (hasUnread && !isOpen) {
      setIsPulsing(true)
    } else {
      setIsPulsing(false)
    }
  }, [hasUnread, isOpen])

  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        bg-brand-blue hover:bg-brand-navy
        text-white shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-brand-blue/30
        ${isOpen ? 'scale-95' : 'scale-100 hover:scale-105'}
        ${isPulsing ? 'animate-pulse-slow' : ''}
      `}
    >
      {/* Unread Indicator */}
      {hasUnread && !isOpen && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full border-2 border-white animate-pulse" />
      )}

      {/* Icon */}
      <div className="relative w-6 h-6">
        {/* Chat Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 transition-all duration-300 ${
            isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 10h.01M12 10h.01M16 10h.01" />
        </svg>

        {/* Close Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 transition-all duration-300 ${
            isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`}
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </div>

      {/* Glassmorphism Effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
    </button>
  )
}
