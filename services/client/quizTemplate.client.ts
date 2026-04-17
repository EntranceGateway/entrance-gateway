import { logger } from '@/lib/logger'
import type { GenerateAttemptResponse, QuizTemplateListResponse, TemplateDetailResponse, Topic, CustomQuizPayload } from '@/types/quizTemplate.types'

export interface QuizTemplateQueryParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

/**
 * Fetch published quiz templates by type.
 * Uses Next.js proxy route: GET /api/quiz-templates/published/[type]
 */
export async function fetchQuizTemplates(
  type: 'PRACTICE' | 'COMPETITIVE',
  params: QuizTemplateQueryParams = {}
): Promise<QuizTemplateListResponse> {
  const {
    page = 0,
    size = 10,
    sortBy = 'createdAt',
    sortDir = 'desc',
  } = params

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir,
  })

  const response = await fetch(`/api/quiz-templates/published/${type}?${queryParams}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status !== 401) {
      logger.error(`[fetchQuizTemplates] Failed to fetch ${type} templates: HTTP ${response.status}`)
    }
    const errorMsg =
      response.status === 401 ? 'UNAUTHORIZED' :
      response.status === 403 ? 'FORBIDDEN' :
      `Failed to fetch ${type.toLowerCase()} templates: ${response.statusText}`
    throw new Error(errorMsg)
  }

  return response.json()
}

/**
 * Generate a quiz attempt from a predefined template.
 * Uses Next.js API proxy route: POST /api/quiz-attempts/generate/[templateId]
 * Backend endpoint: POST /api/v1/quiz-attempts/generate/{templateId}
 * 
 * @param templateId UUID of the template to generate an attempt from
 */
export async function generateQuizAttempt(templateId: string): Promise<GenerateAttemptResponse> {
  try {
    if (!templateId) {
      throw new Error('Template ID is required')
    }

    const response = await fetch(`/api/quiz-attempts/generate/${templateId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      if (response.status !== 401 && response.status !== 403) {
        // Silent error logging
        logger.error('[generateQuizAttempt] API error:', {
          status: response.status,
          statusText: response.statusText,
          templateId
        })
      }

      // Standardized user-friendly error messages based on status code
      if (response.status === 401) {
        throw new Error('Please sign in to generate this quiz.')
      } else if (response.status === 403) {
        throw new Error('You do not have a required subscription to access this practice set.')
      } else if (response.status === 404) {
        throw new Error('Quiz template not found. It may have been removed.')
      } else if (response.status === 400) {
        throw new Error(errorData.message || 'Invalid request. Please try again.')
      } else if (response.status === 408) {
        throw new Error('Request timeout. Please check your connection and try again.')
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(errorData.message || 'Unable to generate quiz. Please try again.')
      }
    }

    const data: GenerateAttemptResponse = await response.json()
    
    if (!data?.data?.attemptId) {
      logger.error('[generateQuizAttempt] Invalid response structure')
      throw new Error('Invalid response from server.')
    }
    
    // Store the snapshot locally so the player UI can access it without a GET API
    if (data.data.questionsSnapshotJson && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(`quiz_attempt_snapshot_${data.data.attemptId}`, data.data.questionsSnapshotJson)
      } catch (e) {
        logger.warn('[generateQuizAttempt] Could not save snapshot to sessionStorage', e)
      }
    }

    return data
  } catch (error) {
    logger.error('[generateQuizAttempt] Error:', error instanceof Error ? error.message : 'Unknown error')
    
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('Unable to generate quiz. Please try again.')
  }
}

/**
 * Fetch a specific quiz template by its ID.
 * Uses Next.js API proxy route: GET /api/quiz-templates/[templateId]
 */
export async function fetchQuizTemplateById(templateId: string): Promise<TemplateDetailResponse> {
  if (!templateId) {
    throw new Error('Template ID is required')
  }

  const response = await fetch(`/api/quiz-templates/${templateId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status !== 401 && response.status !== 404) {
      logger.error(`[fetchQuizTemplateById] Failed to fetch template ${templateId}: HTTP ${response.status}`)
    }
    
    const errorMsg =
      response.status === 401 ? 'UNAUTHORIZED' :
      response.status === 404 ? 'Template not found' :
      `Failed to fetch template details: ${response.statusText}`
    throw new Error(errorMsg)
  }

  return response.json()
}

/**
 * Fetch all available topics for dynamic quiz building.
 * Uses Next.js API proxy route: GET /api/topics/all
 */
export async function fetchAllTopics(): Promise<Topic[]> {
  const response = await fetch('/api/topics/all', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status !== 401 && response.status !== 404) {
      logger.error(`[fetchAllTopics] Failed to fetch topics: HTTP ${response.status}`)
    }
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to initialize topics framework.')
  }

  return response.json()
}

/**
 * Generate a dynamic custom practice quiz attempt based on specific parameters.
 * Uses Next.js API proxy route: POST /api/quiz-attempts/generate/custom
 */
export async function generateCustomQuizAttempt(payload: CustomQuizPayload): Promise<GenerateAttemptResponse> {
  try {
    const response = await fetch('/api/quiz-attempts/generate/custom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      if (response.status !== 401 && response.status !== 403) {
        logger.error('[generateCustomQuizAttempt] API error:', {
          status: response.status,
          statusText: response.statusText,
        })
      }

      if (response.status === 401) {
        throw new Error('Please sign in to generate this practice set.')
      } else if (response.status === 403) {
        throw new Error('You do not have the required access for dynamic generation.')
      } else if (response.status === 400 || response.status === 404) {
        throw new Error(errorData.message || 'Invalid constraints or not enough questions found.')
      } else if (response.status === 408) {
        throw new Error('Request timeout. Your configuration constraints took too long to compile.')
      } else if (response.status >= 500) {
        throw new Error(errorData.message || 'Server error. Please try again later.')
      } else {
        throw new Error(errorData.message || 'Unable to compile custom practice. Please adjust constraints.')
      }
    }

    const data: GenerateAttemptResponse = await response.json()
    
    if (!data?.data?.attemptId) {
      logger.error('[generateCustomQuizAttempt] Invalid response structure')
      throw new Error('Invalid response from compiled generator.')
    }
    
    // Store the snapshot locally so the player UI can access it without a GET API
    if (data.data.questionsSnapshotJson && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(`quiz_attempt_snapshot_${data.data.attemptId}`, data.data.questionsSnapshotJson)
      } catch (e) {
        logger.warn('[generateCustomQuizAttempt] Could not save snapshot to sessionStorage', e)
      }
    }

    return data
  } catch (error) {
    logger.error('[generateCustomQuizAttempt] Error:', error instanceof Error ? error.message : 'Unknown error')
    if (error instanceof Error) throw error
    throw new Error('Unable to compile practice set. Adjust parameters and try again.')
  }
}
