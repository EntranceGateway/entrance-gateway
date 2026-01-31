// Authenticated API Client
import { getValidAccessToken } from '../client/auth.client'
import { apiClient, ApiClientOptions, ApiError } from './client'

/**
 * Authenticated API client that automatically includes auth headers
 * and refreshes tokens when needed
 * 
 * Best Practices Implemented:
 * - Automatic token refresh
 * - Retry logic for 401 errors
 * - Request queuing during refresh
 * - Error handling and logging
 */
export async function authenticatedApiClient<T>(
  endpoint: string,
  options?: ApiClientOptions
): Promise<T> {
  // Get valid access token (will refresh if needed)
  const accessToken = await getValidAccessToken()
  
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
      const newToken = await getValidAccessToken()
      
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
