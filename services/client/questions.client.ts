import type { OldQuestionsListResponse, OldQuestionDetailResponse, OldQuestionsFilters } from '@/types/questions.types'

/**
 * Fetch old questions list (client-side)
 */
export async function fetchOldQuestions(filters?: OldQuestionsFilters): Promise<OldQuestionsListResponse> {
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

    const response = await fetch(`/api/questions?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to fetch old questions' }))
      
      // Handle specific status codes
      if (response.status === 404) {
        throw new Error('No questions found')
      }
      if (response.status === 401) {
        throw new Error('Please sign in to view questions')
      }
      if (response.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again later.')
      }
      
      throw new Error(error.error || 'Failed to fetch old questions')
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
 * Fetch old question by ID (client-side)
 */
export async function fetchOldQuestionById(id: string): Promise<OldQuestionDetailResponse> {
  try {
    // Validate ID
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid question ID')
    }

    const response = await fetch(`/api/questions/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to fetch old question details' }))
      
      // Handle specific status codes
      if (response.status === 404) {
        throw new Error('Question not found')
      }
      if (response.status === 401) {
        throw new Error('Please sign in to view this question')
      }
      if (response.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again later.')
      }
      
      throw new Error(error.error || 'Failed to fetch old question details')
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
