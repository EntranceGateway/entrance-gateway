import { logger } from '@/lib/logger'

export interface QuizAttemptRequest {
  questionSetId: number
  questionAnswers: Array<{
    questionId: number
    selectedOptionId: number | null
  }>
}

export interface QuizAttemptResult {
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  skippedAnswers: number
  totalScore: number
  percentage: number
  rank: number
  percentile: number
  status: string
}

export interface QuizAttemptResponse {
  message: string
  data: QuizAttemptResult
}

/**
 * Submit a completed quiz attempt
 * Uses Next.js API proxy route: POST /api/quiz-attempts
 * Backend endpoint: POST /api/v1/quiz-attempts
 */
export async function submitQuizAttempt(payload: QuizAttemptRequest): Promise<QuizAttemptResponse> {
  try {
    // Validate payload before sending
    if (typeof payload.questionSetId !== 'number' || payload.questionSetId < 0) {
      throw new Error('Invalid quiz ID')
    }
    
    if (!Array.isArray(payload.questionAnswers) || payload.questionAnswers.length === 0) {
      throw new Error('Quiz answers are required')
    }

    const response = await fetch('/api/quiz-attempts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      // Silent error logging - no sensitive data
      logger.error('[submitQuizAttempt] API error:', {
        status: response.status,
        statusText: response.statusText,
        questionSetId: payload.questionSetId,
        answerCount: payload.questionAnswers.length
      })

      // User-friendly error messages based on status code
      if (response.status === 401) {
        throw new Error('Please sign in to submit your quiz.')
      } else if (response.status === 403) {
        throw new Error('You do not have permission to submit this quiz.')
      } else if (response.status === 404) {
        throw new Error('Quiz not found. It may have been removed.')
      } else if (response.status === 400) {
        throw new Error(errorData.message || 'Invalid quiz submission. Please try again.')
      } else if (response.status === 408) {
        throw new Error('Request timeout. Please check your connection and try again.')
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(errorData.message || 'Unable to submit quiz. Please try again.')
      }
    }

    const data: QuizAttemptResponse = await response.json()
    
    // Defensive check for response structure
    if (!data?.data) {
      logger.error('[submitQuizAttempt] Invalid response structure')
      throw new Error('Invalid response from server.')
    }
    
    return data
  } catch (error) {
    // Silent error logging - no sensitive details
    logger.error('[submitQuizAttempt] Error:', error instanceof Error ? error.message : 'Unknown error')
    
    // Re-throw with user-friendly message if not already user-friendly
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('Unable to submit quiz. Please try again.')
  }
}
