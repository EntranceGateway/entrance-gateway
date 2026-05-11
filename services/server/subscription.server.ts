import { getValidTokenOrRefresh } from '@/lib/auth/token'
import { logger } from '@/lib/logger'
import type {
  MySubscriptionResponse,
  SubscriptionPlansResponse,
  SubscriptionPlanResponse,
  SubscriptionStatusResponse,
} from '@/types/subscription.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

export async function getSubscriptionPlans(): Promise<SubscriptionPlanResponse[]> {
  try {
    const accessToken = await getValidTokenOrRefresh()
    const headers: HeadersInit = {
      Accept: 'application/json',
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/plans`, {
      method: 'GET',
      headers,
      next: { revalidate: 1800 },
    })

    const data: SubscriptionPlansResponse = await response.json().catch(() => ({ data: [] }))

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403 && response.status !== 404) {
        logger.error('[getSubscriptionPlans] Failed to fetch plans:', { status: response.status })
      }
      return []
    }

    return Array.isArray(data.data) ? data.data : []
  } catch (error) {
    logger.error('[getSubscriptionPlans] Unexpected error:', error instanceof Error ? error.message : 'Unknown error')
    return []
  }
}

export async function getMySubscription(): Promise<SubscriptionStatusResponse | null> {
  try {
    const accessToken = await getValidTokenOrRefresh()

    if (!accessToken) {
      return null
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })

    const data: MySubscriptionResponse = await response.json().catch(() => ({ data: null }))

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403 && response.status !== 404) {
        logger.error('[getMySubscription] Failed to fetch subscription:', { status: response.status })
      }
      return null
    }

    return data.data
  } catch (error) {
    logger.error('[getMySubscription] Unexpected error:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}
