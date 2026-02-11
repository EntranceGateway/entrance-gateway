import type { CollegesListResponse, CollegeDetailResponse, CollegesFilters } from '@/types/colleges.types'

/**
 * Fetch colleges list (client-side)
 */
export async function fetchColleges(filters?: CollegesFilters): Promise<CollegesListResponse> {
  try {
    const queryParams = new URLSearchParams()

    if (filters?.page !== undefined) queryParams.append('page', filters.page.toString())
    if (filters?.size !== undefined) queryParams.append('size', filters.size.toString())
    if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy)
    if (filters?.sortDir) queryParams.append('sortDir', filters.sortDir)
    if (filters?.location) queryParams.append('location', filters.location)
    if (filters?.affiliation) queryParams.append('affiliation', filters.affiliation)
    if (filters?.collegeType) queryParams.append('collegeType', filters.collegeType)

    const response = await fetch(`/api/colleges?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to fetch colleges' }))
      
      // Handle specific status codes
      if (response.status === 404) {
        throw new Error('No colleges found')
      }
      if (response.status === 401) {
        throw new Error('Please sign in to view colleges')
      }
      if (response.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again later.')
      }
      
      throw new Error(error.error || 'Failed to fetch colleges')
    }

    return response.json()
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Please check your internet connection')
    }
    
    // Re-throw other errors
    throw error
  }
}

/**
 * Fetch college by ID (client-side)
 */
export async function fetchCollegeById(id: string): Promise<CollegeDetailResponse> {
  try {
    // Validate ID
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid college ID')
    }

    const response = await fetch(`/api/colleges/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to fetch college details' }))
      
      // Handle specific status codes
      if (response.status === 404) {
        throw new Error('College not found')
      }
      if (response.status === 401) {
        throw new Error('Please sign in to view this college')
      }
      if (response.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again later.')
      }
      
      throw new Error(error.error || 'Failed to fetch college details')
    }

    return response.json()
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Please check your internet connection')
    }
    
    // Re-throw other errors
    throw error
  }
}
