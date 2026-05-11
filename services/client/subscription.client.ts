import { logger } from '@/lib/logger'
import type {
  MySubscriptionResponse,
  SubscriptionPlansResponse,
  SubscriptionStatusResponse,
  SubscriptionPlanResponse,
  SubscriptionPlan,
  UpgradePriceResponse,
  UpgradePriceApiResponse,
} from '@/types/subscription.types'

function normalizeErrorMessage(status: number, fallback?: string): string {
  if (status === 401) return 'Please sign in to view subscription details.'
  if (status === 403) return 'You do not have permission to access this subscription feature.'
  if (status === 404) return 'Subscription information was not found.'
  if (status >= 500) return 'Subscription service is unavailable. Please try again later.'
  return fallback || 'Unable to load subscription information.'
}

export async function fetchMySubscription(): Promise<SubscriptionStatusResponse | null> {
  try {
    const response = await fetch('/api/subscriptions/me', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    const data: MySubscriptionResponse = await response.json().catch(() => ({ data: null }))

    if (!response.ok) {
      throw new Error(normalizeErrorMessage(response.status, data.message))
    }

    if (!data.data) return null

    const subscription = data.data
    return {
      ...subscription,
      currentPlan: subscription.currentPlan ?? subscription.plan ?? null,
      planName: subscription.planName ?? subscription.plan ?? null,
      quizzesUsedThisMonth: subscription.quizzesUsedThisMonth ?? subscription.monthlyQuotaUsed ?? 0,
      quizzesLimitPerMonth: subscription.quizzesLimitPerMonth ?? subscription.monthlyQuotaLimit ?? 0,
      isActive: subscription.isActive ?? subscription.status === 'ACTIVE',
      autoRenew: subscription.autoRenew ?? false,
    }
  } catch (error) {
    if (error instanceof Error) throw error
    logger.error('[fetchMySubscription] Unexpected error:', error)
    throw new Error('Unable to load subscription information.')
  }
}

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlanResponse[]> {
  try {
    const response = await fetch('/api/subscriptions/plans', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    const data: SubscriptionPlansResponse = await response.json().catch(() => ({ data: [] }))

    if (!response.ok) {
      logger.error('[fetchSubscriptionPlans] API error:', { status: response.status })
      throw new Error(normalizeErrorMessage(response.status, data.message))
    }

    return Array.isArray(data.data) ? data.data : []
  } catch (error) {
    if (error instanceof Error) throw error
    logger.error('[fetchSubscriptionPlans] Unexpected error:', error)
    throw new Error('Unable to load subscription plans.')
  }
}

export async function fetchUpgradePrice(targetPlan: SubscriptionPlan): Promise<UpgradePriceResponse> {
  try {
    const response = await fetch(`/api/subscriptions/upgrade-price/${targetPlan}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    const data: UpgradePriceApiResponse = await response.json().catch(() => ({ data: null as never }))

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403) {
        logger.error('[fetchUpgradePrice] API error:', { status: response.status, targetPlan })
      }
      throw new Error(normalizeErrorMessage(response.status, data.message))
    }

    return data.data
  } catch (error) {
    if (error instanceof Error) throw error
    logger.error('[fetchUpgradePrice] Unexpected error:', error)
    throw new Error('Unable to calculate upgrade price.')
  }
}
