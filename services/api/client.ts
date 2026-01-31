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
 * Handles query parameters, error responses, and JSON parsing
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

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })

    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText,
      }))
      throw new ApiError(
        response.status,
        response.statusText,
        errorData.message || `API Error: ${response.status}`
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    // Network or other errors
    throw new Error(
      error instanceof Error ? error.message : 'Network request failed'
    )
  }
}
