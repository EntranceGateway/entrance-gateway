// Authenticated API Client
// Cookie-based auth - single source of truth
import { apiClient, ApiClientOptions, ApiError } from './client'

/**
 * Authenticated API client that automatically includes auth headers
 * and refreshes tokens when needed
 *
 * Uses cookie-based authentication via API proxy
 * No localStorage - cookies are the single source of truth
 */
export async function authenticatedApiClient<T>(
  endpoint: string,
  options?: ApiClientOptions
): Promise<T> {
  // Get valid access token from cookies (will refresh if needed)
  const accessToken = await getValidAccessTokenFromCookies()

  if (!accessToken) {
    throw new Error('Not authenticated')
  }

  // Add Authorization header
  const headers: HeadersInit = {
    ...options?.headers,
    Authorization: `Bearer ${accessToken}`,
  }

  try {
    return await apiClient<T>(endpoint, {
      ...options,
      headers,
    })
  } catch (error) {
    // Handle 401 Unauthorized - token might have expired during request
    if (error instanceof ApiError && error.status === 401) {
      // Force refresh token and retry once
      // The backend rejected our token, so our current cookie is definitively invalid
      const forceRefresh = true
      const newToken = await getValidAccessTokenFromCookies(forceRefresh)

      if (newToken) {
        const retryHeaders: HeadersInit = {
          ...options?.headers,
          Authorization: `Bearer ${newToken}`,
        }

        return await apiClient<T>(endpoint, {
          ...options,
          headers: retryHeaders,
        })
       }
    }

    throw error
  }
}

/**
 * Get valid access token from cookies via API proxy
 * Automatically refreshes if token is expired.
 * Also applies a 5s timeout to avoid hanging requests.
 */
async function getValidAccessTokenFromCookies(forceRefresh = false): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    try {
      if (!forceRefresh) {
        // Try getting the current token first
        const response = await fetch('/api/auth/token', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          credentials: 'include',
          signal: controller.signal,
        })

        if (response.ok) {
          const data = await response.json()
          const token = data?.accessToken
          if (typeof token === 'string') {
             return token
          }
        }
      }

      // If missing, expired, invalid, or we forced refresh, hit the refresh endpoint
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        signal: controller.signal,
      })

      if (refreshResponse.ok) {
        // Retry fetching token after successful refresh
        const retryResponse = await fetch('/api/auth/token', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          credentials: 'include',
          signal: controller.signal,
        })

        if (retryResponse.ok) {
          const data = await retryResponse.json()
          const newToken = data?.accessToken
          if (typeof newToken === 'string') {
            return newToken
          }
        }
      }

      return null
    } finally {
      clearTimeout(timeoutId)
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('[authenticatedClient] Token fetch timed out after 5s')
    } else {
      console.error('[authenticatedClient] Error fetching valid access token:', error)
    }
    return null
  }
}
