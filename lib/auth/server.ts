import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Get access token from cookies (server-side only)
 */
export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('accessToken')?.value
}

/**
 * Get refresh token from cookies (server-side only)
 */
export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('refreshToken')?.value
}

/**
 * Get user ID from cookies (server-side only)
 */
export async function getUserId(): Promise<number | null> {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  return userId ? parseInt(userId) : null
}

/**
 * Check if user is authenticated (server-side only)
 */
export async function isAuthenticated(): Promise<boolean> {
  const accessToken = await getAccessToken()
  const refreshToken = await getRefreshToken()
  return !!(accessToken || refreshToken)
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth(redirectTo?: string) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    const params = redirectTo ? `?redirect=${redirectTo}` : ''
    redirect(`/signin${params}`)
  }
}

/**
 * Get auth headers for API calls (server-side only)
 */
export async function getAuthHeaders(): Promise<HeadersInit> {
  const accessToken = await getAccessToken()
  
  if (!accessToken) {
    throw new Error('No access token available')
  }
  
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
}
