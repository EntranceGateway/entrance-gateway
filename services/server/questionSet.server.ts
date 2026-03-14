import { cookies } from 'next/headers'
import { apiClient } from '../api/client'
import { logger } from '@/lib/logger'
import type { QuestionSetResponse } from '@/types/quiz-player.types'

/**
 * Fetch question set with all questions (Server-side)
 * Uses apiClient with authentication cookie forwarding
 * Endpoint: GET /api/v1/questions/set/{questionSetId}
 */
export async function getQuestionSet(questionSetId: number): Promise<QuestionSetResponse> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      logger.error('[getQuestionSet] No access token found')
      throw new Error('Authentication required. Please sign in.')
    }

    const response = await apiClient<QuestionSetResponse>(`/api/v1/questions/set/${questionSetId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })

    // Defensive check for response structure
    if (!response?.data) {
      logger.error('[getQuestionSet] Invalid response structure')
      throw new Error('Invalid response from server')
    }

    return response
  } catch (err) {
    // Silent error logging - no sensitive details
    logger.error('[getQuestionSet] Error fetching question set:', err instanceof Error ? err.message : 'Unknown error')
    
    // Re-throw with user-friendly message
    if (err instanceof Error) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        throw new Error('Please sign in to access this quiz.')
      } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
        throw new Error('You do not have access to this quiz.')
      } else if (err.message.includes('404') || err.message.includes('Not Found')) {
        throw new Error('Quiz not found.')
      } else if (err.message.includes('Authentication required')) {
        throw err // Pass through authentication errors
      } else {
        throw new Error('Unable to load quiz questions.')
      }
    }
    
    throw new Error('Unable to load quiz questions.')
  }
}
