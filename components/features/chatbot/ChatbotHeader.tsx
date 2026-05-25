'use client'

interface ChatbotHeaderProps {
  botName: string
  botAvatar?: string
  isOnline?: boolean
  onMinimize?: () => void
  onClose: () => void
  onNewChat?: () => void
}

export function ChatbotHeader({
  botName,
  botAvatar,
  isOnline = true,
  onMinimize,
  onClose,
  onNewChat,
}: ChatbotHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brand-navy to-brand-blue text-white rounded-t-2xl">
      {/* Bot Info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-brand-navy font-bold text-lg shadow-md">
            {botAvatar || 'AI'}
          </div>
          {/* Online Status */}
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
          )}
        </div>

        {/* Bot Name & Status */}
        <div>
          <h3 className="font-semibold text-sm">{botName}</h3>
          <p className="text-xs text-white/80 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* New Chat Button */}
        {onNewChat && (
          <button
            onClick={onNewChat}
            aria-label="New chat"
            title="Start new conversation"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Minimize Button */}
        {onMinimize && (
          <button
            onClick={onMinimize}
            aria-label="Minimize chat"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
