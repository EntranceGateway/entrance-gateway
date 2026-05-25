'use client'

import { ChatbotLauncher } from './ChatbotLauncher'
import { ChatbotWindow } from './ChatbotWindow'
import { useChatbot } from './useChatbot'
import type { ChatbotConfig } from './types'

interface ChatbotWidgetProps {
  config?: Partial<ChatbotConfig>
  apiEndpoint?: string
  className?: string
}

export function ChatbotWidget({
  config = {},
  apiEndpoint = '/api/chatbot',
  className = '',
}: ChatbotWidgetProps) {
  const {
    botName = 'EntranceGateway AI',
    botAvatar = 'AI',
    placeholder = 'Ask me anything about courses, exams, or admissions...',
  } = config

  const {
    isOpen,
    messages,
    isTyping,
    hasUnread,
    sources,
    sendMessage,
    toggleOpen,
    closeChat,
    clearMessages,
  } = useChatbot({
    onError: (error) => {
      console.error('Chatbot error:', error)
    },
  })

  return (
    <div className={`chatbot-widget ${className}`}>
      {/* Chat Window */}
      <ChatbotWindow
        isOpen={isOpen}
        messages={messages}
        isTyping={isTyping}
        sources={sources}
        botName={botName}
        botAvatar={botAvatar}
        placeholder={placeholder}
        onSend={sendMessage}
        onClose={closeChat}
        onNewChat={clearMessages}
      />

      {/* Launcher Button */}
      <ChatbotLauncher isOpen={isOpen} hasUnread={hasUnread} onClick={toggleOpen} />
    </div>
  )
}
