import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'
const TOKEN_EXPIRY_BUFFER_SECONDS = 30

function isJwtExpired(token: string): boolean {
  try {
    const [, payload] = token.split('.')
    if (!payload) return false

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(Buffer.from(normalizedPayload, 'base64').toString('utf8')) as { exp?: number }

    if (typeof decoded.exp !== 'number') return false

    const now = Math.floor(Date.now() / 1000)
    return decoded.exp <= now + TOKEN_EXPIRY_BUFFER_SECONDS
  } catch {
    // If the token is opaque/non-JWT, let the backend validate it.
    return false
  }
}

/**
 * Server-side: Get a valid access token from cookies, auto-refreshing if needed.
 * 
 * 1. Reads accessToken from httpOnly cookies
 * 2. If missing or expired, attempts to refresh using the refreshToken cookie
 * 3. On successful refresh, updates cookies and returns the new access token
 * 4. Returns null if no valid token can be obtained
 */
interface TokenRefreshOptions {
  forceRefresh?: boolean
}

export async function getValidTokenOrRefresh(options: TokenRefreshOptions = {}): Promise<string | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  if (accessToken && !options.forceRefresh && !isJwtExpired(accessToken)) {
    return accessToken
  }

  // No access token, or token is expired/about to expire — try refreshing.
  const refreshToken = cookieStore.get('refreshToken')?.value
  if (!refreshToken) {
    if (accessToken) cookieStore.delete('accessToken')
    return null
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      // Refresh failed — clear stale cookies.
      logger.error('[token.ts] Backend refresh failed:', { status: response.status })
      cookieStore.delete('accessToken')
      cookieStore.delete('refreshToken')
      cookieStore.delete('userId')
      return null
    }

    const token = data?.data?.accessToken
    if (typeof token !== 'string') {
      logger.error('[token.ts] Invalid token format received:', { tokenType: typeof token })
      cookieStore.delete('accessToken')
      cookieStore.delete('refreshToken')
      cookieStore.delete('userId')
      return null
    }

    // Update cookies with new tokens
    cookieStore.set('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.data.expiresIn,
      path: '/',
    })

    if (typeof data.data.refreshToken === 'string') {
      cookieStore.set('refreshToken', data.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
    }

    // Re-set userId cookie
    const existingUserId = cookieStore.get('userId')?.value
    if (existingUserId) {
      cookieStore.set('userId', existingUserId, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    }

    return token
  } catch (error) {
    logger.error('[token.ts] Token refresh failed unexpectedly:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}
