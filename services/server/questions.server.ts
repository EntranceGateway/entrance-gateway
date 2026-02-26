import { cookies } from 'next/headers'
import type { OldQuestionsListResponse, OldQuestionDetailResponse, OldQuestionsFilters } from '@/types/questions.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * Fetch old questions list (server-side)
 */
export async function getOldQuestions(filters?: OldQuestionsFilters): Promise<OldQuestionsListResponse> {
  try {
    const queryParams = new URLSearchParams()

    if (filters?.page !== undefined) queryParams.append('page', filters.page.toString())
    if (filters?.size !== undefined) queryParams.append('size', filters.size.toString())
    if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy)
    if (filters?.sortDir) queryParams.append('sortDir', filters.sortDir)
    if (filters?.courseName) queryParams.append('courseName', filters.courseName)
    if (filters?.affiliation) queryParams.append('affiliation', filters.affiliation)
    if (filters?.year) queryParams.append('year', filters.year.toString())
    if (filters?.subject) queryParams.append('subject', filters.subject)

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/old-question-collections?${queryParams.toString()}`,
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
        throw new Error('No questions found')
      }
      if (response.status === 401) {
        throw new Error('Authentication required')
      }
      if (response.status === 503) {
        throw new Error('Service temporarily unavailable')
      }
      
      throw new Error(errorData.message || `Failed to fetch old questions (${response.status})`)
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
 * Fetch old question by ID or slug (server-side)
 */
export async function getOldQuestionById(identifier: string): Promise<OldQuestionDetailResponse> {
  try {
    if (!identifier || identifier === 'undefined' || identifier === 'null') {
      throw new Error('Invalid question identifier')
    }

    const isSlug = /[a-z-]/.test(identifier)
    const endpoint = isSlug 
      ? `${API_BASE_URL}/api/v1/old-question-collections/slug/${identifier}`
      : `${API_BASE_URL}/api/v1/old-question-collections/${identifier}`

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      if (response.status === 404) {
        throw new Error('Question not found')
      }
      if (response.status === 401) {
        throw new Error('Authentication required')
      }
      if (response.status === 503) {
        throw new Error('Service temporarily unavailable')
      }
      
      throw new Error(errorData.message || `Failed to fetch old question details (${response.status})`)
    }

    return response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server')
    }
    
    throw error
  }
}
