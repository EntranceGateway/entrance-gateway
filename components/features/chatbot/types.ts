// Chatbot Types

export type MessageRole = 'user' | 'assistant' | 'system'
export type MessageStatus = 'sending' | 'sent' | 'error'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  status?: MessageStatus
}

export interface ChatbotConfig {
  botName: string
  botAvatar?: string
  welcomeMessage?: string
  suggestedPrompts?: string[]
  placeholder?: string
  primaryColor?: string
  accentColor?: string
}

export interface ChatbotState {
  isOpen: boolean
  isMinimized: boolean
  messages: ChatMessage[]
  isTyping: boolean
  hasUnread: boolean
  sources: ChatSource[]
  confidence: number
  isStreaming: boolean
}

// Backend API Types

/**
 * Source/citation metadata from the backend
 */
export interface ChatSource {
  number: string
  chunk_id: string
  document_id: string
  source_id: string
  source_type: string
  title: string
}

/**
 * Optional filters for scoping retrieval
 */
export interface ChatFilters {
  source_type?: string
  source_id?: string
  category?: string
}

/**
 * Request payload for chat API
 */
export interface ChatRequest {
  message: string
  session_id?: string | null
  filters?: ChatFilters | null
  top_k?: number
}

/**
 * Response from normal chat API
 */
export interface ChatResponse {
  answer: string
  confidence: number
  sources: ChatSource[]
  session_id: string
  allowed: boolean
  /** Guardrail outcome, e.g. "grounded", "missing_citations", "conversational_templated". */
  reason: string
  /** Classified turn type: "greeting" | "small_talk" | "knowledge". */
  intent?: string
}

/**
 * Streaming event types
 */
export type StreamEventType = 'heartbeat' | 'token' | 'sources' | 'done' | 'error'

/**
 * Streaming event data structures
 */
export interface StreamHeartbeatData {
  status: string
}

export interface StreamTokenData {
  token: string
}

export interface StreamSourcesData {
  sources: ChatSource[]
  confidence: number
  allowed: boolean
  reason: string
  /** Classified turn type: "greeting" | "small_talk" | "knowledge". */
  intent?: string
}

export interface StreamDoneData {
  answer: string
  confidence: number
}

export interface StreamErrorData {
  message: string
}

/**
 * Handlers for streaming events
 */
export interface StreamHandlers {
  onToken: (token: string) => void
  onSources: (payload: StreamSourcesData) => void
  onDone: (payload: StreamDoneData) => void
  onError: (message: string) => void
  onHeartbeat?: () => void
}
