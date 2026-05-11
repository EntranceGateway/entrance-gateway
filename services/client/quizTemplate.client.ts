import { logger } from '@/lib/logger'
import type {
  EntranceType,
  GenerateAttemptResponse,
  QuizTemplateListResponse,
  QuizTemplateStatus,
  QuizTemplateType,
  TemplateDetailResponse,
  Topic,
  CustomQuizPayload,
  CreateQuizTemplateRequest,
  CreateQuizTemplateResponse,
} from '@/types/quizTemplate.types'

export interface QuizTemplateQueryParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

/**
 * Fetch all quiz templates.
 * Uses Next.js proxy route: GET /api/quiz-templates
 */
export async function fetchAllQuizTemplates(
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

  const response = await fetch(`/api/quiz-templates?${queryParams}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status !== 401) {
      logger.error(`[fetchAllQuizTemplates] Failed to fetch templates: HTTP ${response.status}`)
    }
    const errorMsg =
      response.status === 401 ? 'UNAUTHORIZED' :
      response.status === 403 ? 'FORBIDDEN' :
      `Failed to fetch quiz templates: ${response.statusText}`
    throw new Error(errorMsg)
  }

  return response.json()
}

/**
 * Fetch published quiz templates by type.
 * Uses Next.js proxy route: GET /api/quiz-templates/published/[type]
 */
export async function fetchQuizTemplates(
  type: QuizTemplateType,
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

function buildTemplateQueryParams(params: QuizTemplateQueryParams = {}): URLSearchParams {
  const {
    page = 0,
    size = 10,
    sortBy = 'createdAt',
    sortDir = 'desc',
  } = params

  return new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir,
  })
}

async function fetchTemplateList(endpoint: string, logContext: string): Promise<QuizTemplateListResponse> {
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status !== 401) {
      logger.error(`[${logContext}] Failed to fetch templates: HTTP ${response.status}`)
    }
    const errorMsg =
      response.status === 401 ? 'UNAUTHORIZED' :
      response.status === 403 ? 'FORBIDDEN' :
      `Failed to fetch quiz templates: ${response.statusText}`
    throw new Error(errorMsg)
  }

  return response.json()
}

export async function fetchQuizTemplatesByType(
  type: QuizTemplateType,
  params: QuizTemplateQueryParams = {}
): Promise<QuizTemplateListResponse> {
  return fetchTemplateList(
    `/api/quiz-templates/type/${type}?${buildTemplateQueryParams(params)}`,
    'fetchQuizTemplatesByType'
  )
}

export async function fetchQuizTemplatesByStatus(
  status: QuizTemplateStatus,
  params: QuizTemplateQueryParams = {}
): Promise<QuizTemplateListResponse> {
  return fetchTemplateList(
    `/api/quiz-templates/status/${status}?${buildTemplateQueryParams(params)}`,
    'fetchQuizTemplatesByStatus'
  )
}

export async function fetchQuizTemplatesByEntrance(
  slug: string,
  params: QuizTemplateQueryParams = {}
): Promise<QuizTemplateListResponse> {
  return fetchTemplateList(
    `/api/quiz-templates/entrance/${encodeURIComponent(slug)}?${buildTemplateQueryParams(params)}`,
    'fetchQuizTemplatesByEntrance'
  )
}

export async function fetchQuizTemplatesByEntranceAndStatus(
  slug: string,
  status: QuizTemplateStatus,
  params: QuizTemplateQueryParams = {}
): Promise<QuizTemplateListResponse> {
  return fetchTemplateList(
    `/api/quiz-templates/entrance/${encodeURIComponent(slug)}/status/${status}?${buildTemplateQueryParams(params)}`,
    'fetchQuizTemplatesByEntranceAndStatus'
  )
}

export async function fetchGlobalQuizTemplates(
  params: QuizTemplateQueryParams = {}
): Promise<QuizTemplateListResponse> {
  return fetchTemplateList(
    `/api/quiz-templates/global?${buildTemplateQueryParams(params)}`,
    'fetchGlobalQuizTemplates'
  )
}

export async function fetchEntranceTypes(): Promise<EntranceType[]> {
  const response = await fetch('/api/entrance-types', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  const responseData = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status !== 401 && response.status !== 404) {
      logger.error(`[fetchEntranceTypes] Failed to fetch entrance types: HTTP ${response.status}`)
    }
    throw new Error(responseData?.message || 'Failed to load entrance types.')
  }

  if (Array.isArray(responseData)) {
    return responseData
  }

  if (Array.isArray(responseData?.data)) {
    return responseData.data
  }

  if (Array.isArray(responseData?.data?.content)) {
    return responseData.data.content
  }

  logger.error('[fetchEntranceTypes] Invalid entrance types response structure')
  return []
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

      const actionType = errorData?.actionType || errorData?.data?.actionType
      const backendMessage = errorData?.message || ''

      if (response.status !== 401 && response.status !== 402 && response.status !== 403) {
        // Silent error logging
        logger.error('[generateQuizAttempt] API error:', {
          status: response.status,
          statusText: response.statusText,
          actionType,
          templateId
        })
      }

      // Subscription/access workflow errors are expected business responses, not auth failures.
      if (response.status === 402 || actionType) {
        const normalizedAction = String(actionType || '').toUpperCase()
        if (normalizedAction.includes('QUOTA')) {
          throw new Error(backendMessage || 'Silver quiz quota reached. Please upgrade to Gold or Premium.')
        }
        if (normalizedAction.includes('PURCHASE')) {
          throw new Error(backendMessage || 'Purchase required to start this competitive quiz.')
        }
        if (normalizedAction.includes('UPGRADE')) {
          throw new Error(backendMessage || 'Please upgrade your subscription to access this quiz.')
        }
        throw new Error(backendMessage || 'Active practice subscription required to start this quiz.')
      }

      // Standardized user-friendly error messages based on status code
      if (response.status === 401) {
        throw new Error('Please sign in to generate this quiz.')
      } else if (response.status === 403) {
        throw new Error(errorData.message || 'You do not have a required subscription to access this practice set.')
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
    
    await persistGeneratedAttemptSnapshot(data, 'generateQuizAttempt')

    return data
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const isExpectedAuthError =
      message.toLowerCase().includes('sign in') ||
      message.toLowerCase().includes('subscription') ||
      message.toLowerCase().includes('permission')

    if (!isExpectedAuthError) {
      logger.error('[generateQuizAttempt] Error:', message)
    }
    
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
export async function fetchMyQuizTemplates(params: QuizTemplateQueryParams = {}): Promise<QuizTemplateListResponse> {
  const queryParams = buildTemplateQueryParams(params)

  const response = await fetch(`/api/quiz-templates/my-templates?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  const responseData = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status !== 401 && response.status !== 403) {
      logger.error(`[fetchMyQuizTemplates] Failed: HTTP ${response.status}`)
    }
    throw new Error(responseData?.message || 'Unable to fetch your templates.')
  }

  return responseData
}

export async function archiveMyQuizTemplate(templateId: string): Promise<{ message?: string }> {
  const response = await fetch(`/api/quiz-templates/my-templates/${encodeURIComponent(templateId)}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  })

  const responseData = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status !== 401 && response.status !== 403 && response.status !== 404) {
      logger.error(`[archiveMyQuizTemplate] Failed: HTTP ${response.status}`)
    }
    throw new Error(responseData?.message || 'Unable to archive this template.')
  }

  return responseData || {}
}

export async function createQuizTemplates(
  payload: CreateQuizTemplateRequest[]
): Promise<CreateQuizTemplateResponse> {
  const response = await fetch('/api/quiz-templates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const responseData = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status !== 401 && response.status !== 403) {
      logger.error(`[createQuizTemplates] Failed: HTTP ${response.status}`)
    }
    throw new Error(responseData?.message || 'Unable to create quiz template.')
  }

  return responseData
}

export async function fetchAllTopics(): Promise<Topic[]> {
  const response = await fetch('/api/topics/all', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  const responseData = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status !== 401 && response.status !== 404) {
      logger.error(`[fetchAllTopics] Failed to fetch topics: HTTP ${response.status}`)
    }
    throw new Error(responseData?.message || 'Failed to initialize topics framework.')
  }

  if (Array.isArray(responseData)) {
    return responseData
  }

  if (Array.isArray(responseData?.data)) {
    return responseData.data
  }

  if (Array.isArray(responseData?.data?.content)) {
    return responseData.data.content
  }

  logger.error('[fetchAllTopics] Invalid topics response structure')
  return []
}

export async function fetchTopicsByEntrance(slug: string): Promise<Topic[]> {
  if (!slug) {
    return fetchAllTopics()
  }

  const response = await fetch(`/api/topics/entrance/${encodeURIComponent(slug)}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  const responseData = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status !== 401 && response.status !== 404) {
      logger.error(`[fetchTopicsByEntrance] Failed to fetch topics for ${slug}: HTTP ${response.status}`)
    }
    throw new Error(responseData?.message || 'Failed to load topics for the selected entrance type.')
  }

  if (Array.isArray(responseData)) {
    return responseData
  }

  if (Array.isArray(responseData?.data)) {
    return responseData.data
  }

  if (Array.isArray(responseData?.data?.content)) {
    return responseData.data.content
  }

  logger.error('[fetchTopicsByEntrance] Invalid topics response structure')
  return []
}

async function persistGeneratedAttemptSnapshot(data: GenerateAttemptResponse, logContext: string) {
  if (data.data.questionsSnapshotJson && typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(`quiz_attempt_snapshot_${data.data.attemptId}`, data.data.questionsSnapshotJson)
    } catch (e) {
      logger.warn(`[${logContext}] Could not save snapshot to sessionStorage`, e)
    }
  }
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

        const actionType = errorData?.actionType || errorData?.data?.actionType

        if (response.status !== 401 && response.status !== 402 && response.status !== 403) {
          logger.error('[generateCustomQuizAttempt] API error:', {
            status: response.status,
            statusText: response.statusText,
            actionType,
          })
        }

        if (response.status === 402 || actionType) {
          const normalizedAction = String(actionType || '').toUpperCase()
          if (normalizedAction.includes('QUOTA')) {
            throw new Error(errorData.message || 'Silver quiz quota reached. Please upgrade to Gold or Premium.')
          }
          if (normalizedAction.includes('UPGRADE')) {
            throw new Error(errorData.message || 'Please upgrade your subscription to generate this practice set.')
          }
          throw new Error(errorData.message || 'Active practice subscription required to generate this quiz.')
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
    
    await persistGeneratedAttemptSnapshot(data, 'generateCustomQuizAttempt')

    return data
  } catch (error) {
    logger.error('[generateCustomQuizAttempt] Error:', error instanceof Error ? error.message : 'Unknown error')
    if (error instanceof Error) throw error
    throw new Error('Unable to compile practice set. Adjust parameters and try again.')
  }
}

export async function generateCustomQuizAttemptForEntrance(
  slug: string,
  payload: CustomQuizPayload
): Promise<GenerateAttemptResponse> {
  try {
    const response = await fetch(`/api/quiz-attempts/generate/custom/entrance/${encodeURIComponent(slug)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

        const actionType = errorData?.actionType || errorData?.data?.actionType

        if (response.status !== 401 && response.status !== 402 && response.status !== 403) {
          logger.error('[generateCustomQuizAttemptForEntrance] API error:', {
            status: response.status,
            statusText: response.statusText,
            slug,
            actionType,
          })
        }

        if (response.status === 402 || actionType) {
          const normalizedAction = String(actionType || '').toUpperCase()
          if (normalizedAction.includes('QUOTA')) {
            throw new Error(errorData.message || 'Silver quiz quota reached. Please upgrade to Gold or Premium.')
          }
          if (normalizedAction.includes('ENTRANCE') || normalizedAction.includes('UPGRADE')) {
            throw new Error(errorData.message || 'Upgrade your subscription to access this entrance type.')
          }
          throw new Error(errorData.message || 'Active practice subscription required to generate this quiz.')
        }

      if (response.status === 401) {
        throw new Error('Please sign in to generate this practice set.')
      } else if (response.status === 403) {
        throw new Error('You do not have the required access for this entrance practice set.')
      } else if (response.status === 400 || response.status === 404) {
        throw new Error(errorData.message || 'Invalid constraints or not enough entrance questions found.')
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
      logger.error('[generateCustomQuizAttemptForEntrance] Invalid response structure')
      throw new Error('Invalid response from compiled generator.')
    }

    await persistGeneratedAttemptSnapshot(data, 'generateCustomQuizAttemptForEntrance')

    return data
  } catch (error) {
    logger.error('[generateCustomQuizAttemptForEntrance] Error:', error instanceof Error ? error.message : 'Unknown error')
    if (error instanceof Error) throw error
    throw new Error('Unable to compile entrance practice set. Adjust parameters and try again.')
  }
}

