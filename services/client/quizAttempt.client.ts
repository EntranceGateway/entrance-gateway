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

export interface GeneratedAttemptSubmission {
  questionSetId: number
  questionAnswers: Array<{
    questionId: number
    selectedOptionId: number | null
  }>
}

export interface GeneratedAttemptResponse {
  message: string
  data: {
    attemptId: number
    score: number
    isSubmitted: boolean
    attemptedAt: string
  }
}

export interface QuizAttemptDetailResponse {
  message: string
  data: {
    attemptId: number
    user?: {
      userId: number
      email: string
    }
    quizTemplate?: {
      templateId: string
      name: string
      type: string
    }
    questionsSnapshotJson: string
    score: number
    isSubmitted: boolean
    attemptedAt: string
  }
}

export interface QuizHistoryItem {
  id: number
  quizId: number
  quizName: string
  totalScore: number
  correctAnswers: number
  wrongAnswers: number
  skippedAnswers: number
  totalQuestions: number
  timeTakenSeconds: number
  percentage: number
  status: string
  attemptedAt: string
}

export interface QuizHistoryResponse {
  message: string
  data: QuizHistoryItem[]
}

export interface CategoryAnalysisItem {
  topicName: string
  totalQuestions: number
  correctQuestions: number
  percentage: number
}

export interface CategoryAnalysisResponse {
  message: string
  data: CategoryAnalysisItem[]
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

/**
 * Submit a generated quiz attempt (Custom/Template)
 * Uses Next.js API proxy route: POST /api/quiz-attempts/[attemptId]/submit
 */
export async function submitGeneratedAttempt(attemptId: number, payload: GeneratedAttemptSubmission): Promise<GeneratedAttemptResponse> {
  try {
    if (!attemptId || isNaN(attemptId) || attemptId <= 0) {
      throw new Error('Invalid attempt identifier.')
    }

    if (!Array.isArray(payload.questionAnswers) || payload.questionAnswers.length === 0) {
      throw new Error('Answers missing from submission.')
    }

    const response = await fetch(`/api/quiz-attempts/${attemptId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      if (response.status !== 401 && response.status !== 403) {
        logger.error('[submitGeneratedAttempt] API error:', {
          status: response.status,
          attemptId
        })
      }

      if (response.status === 401) {
        throw new Error('Please sign in to submit your quiz.')
      } else if (response.status === 403) {
        throw new Error('You do not have permission to submit this quiz.')
      } else if (response.status === 404) {
        throw new Error('Attempt not found or expired.')
      } else if (response.status === 400) {
        throw new Error(errorData.message || 'Quiz already submitted.')
      } else {
        throw new Error(errorData.message || 'Unable to submit graded results.')
      }
    }

    const data: GeneratedAttemptResponse = await response.json()
    if (!data?.data) {
      logger.error('[submitGeneratedAttempt] Invalid structure')
      throw new Error('Invalid grading response from server.')
    }

    return data
  } catch (error) {
    logger.error('[submitGeneratedAttempt] Error:', error instanceof Error ? error.message : 'Unknown error')
    if (error instanceof Error) throw error
    throw new Error('Unable to finalize attempt grading.')
  }
}

/**
 * Fetch a specific generated quiz attempt by ID
 * Uses Next.js API proxy route: GET /api/quiz-attempts/[attemptId]
 */
export async function getGeneratedQuizAttempt(attemptId: number): Promise<QuizAttemptDetailResponse> {
  try {
    if (!attemptId || isNaN(attemptId) || attemptId <= 0) {
      throw new Error('Invalid attempt identifier.')
    }

    const response = await fetch(`/api/quiz-attempts/${attemptId}`, {
      method: 'GET',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      if (response.status !== 401 && response.status !== 403 && response.status !== 404) {
        logger.error('[getGeneratedQuizAttempt] API error:', {
          status: response.status,
          attemptId
        })
      }

      if (response.status === 401) {
        throw new Error('Please sign in to access this quiz.')
      } else if (response.status === 403) {
        throw new Error('You do not have permission to access this practice set.')
      } else if (response.status === 404) {
        throw new Error('Practice set not found or deleted.')
      } else {
        throw new Error(errorData.message || 'Unable to load practice set details.')
      }
    }

    const data: QuizAttemptDetailResponse = await response.json()
    if (!data?.data?.questionsSnapshotJson) {
      logger.error('[getGeneratedQuizAttempt] Invalid structure')
      throw new Error('Invalid quiz response structure from server.')
    }

    return data
  } catch (error) {
    logger.error('[getGeneratedQuizAttempt] Error:', error instanceof Error ? error.message : 'Unknown error')
    if (error instanceof Error) throw error
    throw new Error('Unable to load practice set.')
  }
}

/**
 * Fetch the user's comprehensive quiz history
 * Uses Next.js API proxy route: GET /api/quiz-attempts/history
 */
export async function fetchQuizAttemptHistory(): Promise<QuizHistoryResponse> {
  try {
    const response = await fetch('/api/quiz-attempts/history', {
      method: 'GET',
    })

    if (!response.ok) {
      if (response.status !== 401) {
        logger.error('[fetchQuizAttemptHistory] API error:', response.status)
      }

      if (response.status === 401) {
        throw new Error('Please sign in to view your history.')
      } else {
        throw new Error('Unable to securely load history records at this time.')
      }
    }

    const data: QuizHistoryResponse = await response.json()
    if (!Array.isArray(data?.data)) {
      logger.error('[fetchQuizAttemptHistory] Invalid structure retrieved')
      throw new Error('Invalid history format returned from server.')
    }

    return data
  } catch (error) {
    logger.error('[fetchQuizAttemptHistory] Error:', error instanceof Error ? error.message : 'Unknown error')
    if (error instanceof Error) throw error
    throw new Error('Unable to retrieve quiz history logs.')
  }
}

/**
 * Fetch the user's category-wise correctness analysis
 * Uses Next.js API proxy route: GET /api/quiz-attempts/analysis
 */
export async function fetchCategoryAnalysis(): Promise<CategoryAnalysisResponse> {
  try {
    const response = await fetch('/api/quiz-attempts/analysis', {
      method: 'GET',
    })

    if (!response.ok) {
      if (response.status !== 401) {
        logger.error('[fetchCategoryAnalysis] API error:', response.status)
      }

      if (response.status === 401) {
        throw new Error('Please sign in to view your category analytics.')
      } else {
        throw new Error('Unable to securely load category analytics at this time.')
      }
    }

    const data: CategoryAnalysisResponse = await response.json()
    if (!Array.isArray(data?.data)) {
      logger.error('[fetchCategoryAnalysis] Invalid structure retrieved')
      throw new Error('Invalid analysis format returned from server.')
    }

    return data
  } catch (error) {
    logger.error('[fetchCategoryAnalysis] Error:', error instanceof Error ? error.message : 'Unknown error')
    if (error instanceof Error) throw error
    throw new Error('Unable to retrieve topic analysis logs.')
  }
}
