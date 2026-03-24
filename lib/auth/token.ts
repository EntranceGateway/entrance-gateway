import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * Server-side: Get a valid access token from cookies, auto-refreshing if needed.
 * 
 * 1. Reads accessToken from httpOnly cookies
 * 2. If missing, attempts to refresh using the refreshToken cookie
 * 3. On successful refresh, updates cookies and returns the new access token
 * 4. Returns null if no valid token can be obtained
 */
export async function getValidTokenOrRefresh(): Promise<string | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  if (accessToken) {
    return accessToken
  }

  // No access token — try refreshing
  const refreshToken = cookieStore.get('refreshToken')?.value
  if (!refreshToken) {
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
      // Refresh failed — clear stale cookies
      console.error('[token.ts] Backend refresh failed:', response.status, data)
      cookieStore.delete('accessToken')
      cookieStore.delete('refreshToken')
      cookieStore.delete('userId')
      return null
    }

    // Update cookies with new tokens
    cookieStore.set('accessToken', data.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.data.expiresIn,
      path: '/',
    })

    cookieStore.set('refreshToken', data.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

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

    const token = data?.data?.accessToken
    if (typeof token !== 'string') {
      console.error('[token.ts] Invalid token format received:', typeof token)
      return null
    }

    return token
  } catch {
    return null
  }
}
