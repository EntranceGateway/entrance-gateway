/**
 * Session Management Utilities for Chatbot
 * 
 * Handles session ID generation, storage, and lifecycle management
 * for maintaining conversation context across page reloads.
 */

const SESSION_STORAGE_KEY = 'eg_chat_session_id'

/**
 * Generates a new UUID v4 session ID
 */
function generateSessionId(): string {
  return crypto.randomUUID()
}

/**
 * Gets the current session ID from localStorage, or creates a new one if it doesn't exist
 * 
 * @returns The current or newly created session ID
 */
export function getOrCreateChatSessionId(): string {
  if (typeof window === 'undefined') {
    // Server-side rendering - return a temporary ID
    return 'ssr-temp-session'
  }

  try {
    const existing = localStorage.getItem(SESSION_STORAGE_KEY)
    if (existing) {
      return existing
    }

    const newSessionId = generateSessionId()
    localStorage.setItem(SESSION_STORAGE_KEY, newSessionId)
    return newSessionId
  } catch (error) {
    console.error('Failed to access localStorage for session management:', error)
    // Fallback to in-memory session ID
    return `fallback-${Date.now()}`
  }
}

/**
 * Resets the chat session by removing the stored session ID
 * This will cause a new session to be created on the next chat message
 */
export function resetChatSession(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem(SESSION_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to reset chat session:', error)
  }
}

/**
 * Gets the current session ID without creating a new one
 * 
 * @returns The current session ID or null if none exists
 */
export function getCurrentSessionId(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return localStorage.getItem(SESSION_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to get current session ID:', error)
    return null
  }
}

/**
 * Validates if a session ID is in the correct UUID v4 format
 * 
 * @param sessionId The session ID to validate
 * @returns True if valid, false otherwise
 */
export function isValidSessionId(sessionId: string): boolean {
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidV4Regex.test(sessionId)
}
