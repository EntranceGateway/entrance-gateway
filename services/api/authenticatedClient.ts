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
      // Try to refresh token and retry once
      const newToken = await getValidAccessTokenFromCookies()

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
 * Automatically refreshes if token is expired
 */
async function getValidAccessTokenFromCookies(): Promise<string | null> {
  try {
    // First, try to get current token
    const response = await fetch('/api/auth/token', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      return data.accessToken
    }

    // Token not found or expired - try to refresh
    if (response.status === 401) {
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })

      if (refreshResponse.ok) {
        // Retry fetching token after refresh
        const retryResponse = await fetch('/api/auth/token', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          credentials: 'include',
        })

        if (retryResponse.ok) {
          const data = await retryResponse.json()
          return data.accessToken
        }
      }
    }

    return null
  } catch {
    return null
  }
}
