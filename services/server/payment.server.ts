import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'
import type { PurchaseStatusResponse } from '@/types/payment.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * Check quiz purchase status (Server-side)
 * Backend endpoint: GET /api/v1/purchases/quizzes/{quizId}/status
 */
export async function checkQuizPurchaseStatus(
  quizId: number
): Promise<PurchaseStatusResponse | null> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      // Return NOT_PURCHASED for unauthenticated users
      return {
        message: 'Quiz purchase status',
        data: {
          status: 'NOT_PURCHASED',
          purchaseId: null,
          purchaseDate: null,
          amountPaid: null,
        },
      }
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/purchases/quizzes/${quizId}/status`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      }
    )

    if (!response.ok) {
      if (response.status !== 404) {
        logger.error(`[SSR] Error checking purchase status for quiz ${quizId}: HTTP ${response.status}`)
      }
      return {
        message: 'Quiz purchase status',
        data: {
          status: 'NOT_PURCHASED',
          purchaseId: null,
          purchaseDate: null,
          amountPaid: null,
        },
      }
    }

    const data = await response.json()
    return data
  } catch (error) {
    logger.error(`[SSR] Error checking purchase status for quiz ${quizId}:`, error instanceof Error ? error.message : 'Unknown error')
    return {
      message: 'Quiz purchase status',
      data: {
        status: 'NOT_PURCHASED',
        purchaseId: null,
        purchaseDate: null,
        amountPaid: null,
      },
    }
  }
}

/**
 * Check multiple quiz purchase statuses in parallel (Server-side)
 * Useful for quiz list pages
 */
export async function checkMultipleQuizPurchaseStatuses(
  quizIds: number[]
): Promise<Map<number, PurchaseStatusResponse>> {
  const statusMap = new Map<number, PurchaseStatusResponse>()

  if (!Array.isArray(quizIds) || quizIds.length === 0) {
    return statusMap
  }

  try {
    const results = await Promise.allSettled(
      quizIds.map(id => checkQuizPurchaseStatus(id))
    )

    results.forEach((result, index) => {
      const quizId = quizIds[index]
      if (result.status === 'fulfilled' && result.value) {
        statusMap.set(quizId, result.value)
      } else {
        logger.error(`[SSR] Promise rejected for quiz ${quizId}`)
        statusMap.set(quizId, {
          message: 'Quiz purchase status',
          data: {
            status: 'NOT_PURCHASED',
            purchaseId: null,
            purchaseDate: null,
            amountPaid: null,
          },
        })
      }
    })
  } catch (error) {
    logger.error('[SSR] Error checking multiple purchase statuses:', error instanceof Error ? error.message : 'Unknown error')
  }

  return statusMap
}
