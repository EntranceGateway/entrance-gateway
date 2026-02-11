import { cookies } from 'next/headers'
import type { CollegesListResponse, CollegeDetailResponse, CollegesFilters } from '@/types/colleges.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * Fetch colleges list (server-side)
 */
export async function getColleges(filters?: CollegesFilters): Promise<CollegesListResponse> {
  try {
    const queryParams = new URLSearchParams()

    if (filters?.page !== undefined) queryParams.append('page', filters.page.toString())
    if (filters?.size !== undefined) queryParams.append('size', filters.size.toString())
    if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy)
    if (filters?.sortDir) queryParams.append('sortDir', filters.sortDir)
    if (filters?.location) queryParams.append('location', filters.location)
    if (filters?.affiliation) queryParams.append('affiliation', filters.affiliation)
    if (filters?.collegeType) queryParams.append('collegeType', filters.collegeType)

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/colleges?${queryParams.toString()}`,
      {
        method: 'GET',
        headers,
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      // Handle specific status codes
      if (response.status === 404) {
        throw new Error('No colleges found')
      }
      if (response.status === 401) {
        throw new Error('Authentication required')
      }
      if (response.status === 503) {
        throw new Error('Service temporarily unavailable')
      }
      
      throw new Error(errorData.message || `Failed to fetch colleges (${response.status})`)
    }

    return response.json()
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server')
    }
    
    // Re-throw other errors
    throw error
  }
}

/**
 * Fetch college by ID (server-side)
 */
export async function getCollegeById(id: string): Promise<CollegeDetailResponse> {
  try {
    // Validate ID
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid college ID')
    }

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/colleges/${id}`,
      {
        method: 'GET',
        headers,
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      // Handle specific status codes
      if (response.status === 404) {
        throw new Error('College not found')
      }
      if (response.status === 401) {
        throw new Error('Authentication required')
      }
      if (response.status === 503) {
        throw new Error('Service temporarily unavailable')
      }
      
      throw new Error(errorData.message || `Failed to fetch college details (${response.status})`)
    }

    return response.json()
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server')
    }
    
    // Re-throw other errors
    throw error
  }
}
