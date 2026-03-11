// API Client Configuration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

export interface ApiClientOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Generic API client for making HTTP requests
 * Handles query parameters, error responses, JSON parsing, and timeouts
 */
export async function apiClient<T>(
  endpoint: string,
  options?: ApiClientOptions
): Promise<T> {
  const { params, ...fetchOptions } = options || {}

  // Build URL with query parameters
  let url = `${API_BASE_URL}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  // Default headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }

  // Add timeout (default 30 seconds) - merge with user-provided signal if exists
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000)

  // If user provided a signal, listen to it and abort our controller
  const userSignal = fetchOptions.signal
  if (userSignal) {
    userSignal.addEventListener('abort', () => controller.abort())
  }

  try {
    const response = await fetch(url, {
      credentials: 'include', // Always include cookies for cross-origin requests
      ...fetchOptions,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Check response.ok before parsing JSON
    if (!response.ok) {
      // Try to parse JSON error response, fallback to text
      let errorMessage = response.statusText
      try {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } else {
          // Non-JSON error response
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        }
      } catch {
        // If parsing fails, use statusText
      }

      throw new ApiError(
        response.status,
        response.statusText,
        errorMessage
      )
    }

    // Handle 204 No Content and other empty responses
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as T
    }

    // Parse JSON response only if content-type is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Expected JSON response but received different content type')
    }

    return response.json()
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof ApiError) {
      throw error
    }
    
    // Handle timeout
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - please try again')
    }

    // Network or other errors
    throw new Error(
      error instanceof Error ? error.message : 'Network request failed'
    )
  }
}
