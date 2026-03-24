/**
 * Cookie-based authentication utilities
 * Single source of truth for auth state - no localStorage
 */

/**
 * Parse cookies from document.cookie (client-side only)
 */
function parseCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {}

  const cookies: Record<string, string> = {}
  const cookieString = document.cookie

  if (!cookieString) return {}

  cookieString.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=')
    const trimmedName = name.trim()
    const value = rest.join('=').trim()
    if (trimmedName && value) {
      cookies[trimmedName] = value
    }
  })

  return cookies
}

/**
 * Get access token from cookie (client-side)
 * Note: This only works for non-httpOnly cookies
 * For httpOnly cookies, use server-side functions or API proxy
 */
export function getAccessTokenFromCookie(): string | null {
  const cookies = parseCookies()
  return cookies['accessToken'] || null
}

/**
 * Get user ID from cookie (client-side)
 */
export function getUserIdFromCookie(): number | null {
  const cookies = parseCookies()
  const userId = cookies['userId']
  if (!userId) return null
  const parsed = parseInt(userId)
  return Number.isNaN(parsed) ? null : parsed
}

/**
 * Check if user is authenticated (client-side)
 * Checks for userId cookie presence
 */
export function isAuthenticatedFromCookie(): boolean {
  return getUserIdFromCookie() !== null
}

/**
 * Get access token via API proxy (reads httpOnly cookies server-side)
 * This is the recommended way for CSR components to get tokens
 */
export async function fetchAccessToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/token', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include',
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    const token = data?.accessToken
    if (typeof token !== 'string') return null
    
    return token
  } catch (error) {
    if (error instanceof TypeError) {
       console.error('[cookie.ts] Network error fetching access token:', error.message)
    }
    return null
  }
}

/**
 * Get valid access token with automatic refresh
 * Uses cookie-based auth with API proxy
 */
export async function getValidAccessToken(): Promise<string | null> {
  // Try to get token from API proxy (reads httpOnly cookies)
  let token = await fetchAccessToken()

  if (token) {
    return token
  }

  // Token might be expired - try to refresh
  try {
    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })

    if (refreshResponse.ok) {
      // Retry fetching token after refresh
      token = await fetchAccessToken()
      return token
    }
  } catch {
    // Refresh failed
  }

  return null
}
