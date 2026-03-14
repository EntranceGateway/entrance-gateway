import { logger } from '@/lib/logger'

/**
 * Fetch question set with all questions
 * Uses Next.js API proxy route: GET /api/question-sets/[id]
 * Backend endpoint: GET /api/v1/questions/set/{questionSetId}
 */
export async function fetchQuestionSet(questionSetId: number) {
  try {
    const response = await fetch(`/api/question-sets/${questionSetId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      // Silent error logging
      logger.error('[fetchQuestionSet] API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      
      // User-friendly error messages based on status code
      if (response.status === 401) {
        throw new Error('Please sign in to access this quiz.')
      } else if (response.status === 403) {
        throw new Error('You do not have access to this quiz. Please purchase it first.')
      } else if (response.status === 404) {
        throw new Error('Quiz not found. It may have been removed.')
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(errorData.message || 'Unable to load quiz questions.')
      }
    }

    const data = await response.json()
    
    // Defensive check for response structure
    if (!data?.data) {
      logger.error('[fetchQuestionSet] Invalid response structure:', data)
      throw new Error('Invalid response from server.')
    }
    
    return data
  } catch (error) {
    // Silent error logging - don't expose internal details
    logger.error('[fetchQuestionSet] Error:', error)
    
    // Re-throw with user-friendly message if not already user-friendly
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('Unable to load quiz questions. Please try again.')
  }
}
