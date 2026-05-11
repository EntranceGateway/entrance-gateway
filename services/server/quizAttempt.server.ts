import { getValidTokenOrRefresh } from '@/lib/auth/token'
import { logger } from '@/lib/logger'
import type { QuizHistoryResponse } from '@/services/client/quizAttempt.client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

export async function getQuizAttemptHistory(): Promise<QuizHistoryResponse | null> {
  const accessToken = await getValidTokenOrRefresh()

  if (!accessToken) {
    return null
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/quiz-attempts/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403) {
        logger.error('[getQuizAttemptHistory] Backend error:', { status: response.status })
      }
      return null
    }

    if (!Array.isArray(data?.data)) {
      logger.error('[getQuizAttemptHistory] Invalid response structure')
      return null
    }

    return data
  } catch (error) {
    logger.error('[getQuizAttemptHistory] Failed:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}
