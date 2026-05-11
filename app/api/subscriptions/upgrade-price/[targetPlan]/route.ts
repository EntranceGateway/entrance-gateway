import { NextResponse } from 'next/server'
import { fetchWithAuthRetry } from '@/lib/auth/apiProxy'
import { logger } from '@/lib/logger'
import type { SubscriptionPlan } from '@/types/subscription.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'
const VALID_PLANS: SubscriptionPlan[] = ['SILVER', 'GOLD', 'PREMIUM']

export async function GET(
  request: Request,
  { params }: { params: Promise<{ targetPlan: string }> }
) {
  try {
    const { targetPlan } = await params
    const normalizedPlan = targetPlan?.toUpperCase() as SubscriptionPlan

    if (!VALID_PLANS.includes(normalizedPlan)) {
      return NextResponse.json(
        { message: 'Invalid subscription plan.', data: null },
        { status: 400 }
      )
    }

    const { response } = await fetchWithAuthRetry(
      `${API_BASE_URL}/api/v1/subscriptions/upgrade-price/${normalizedPlan}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
    )

    if (!response) {
      return NextResponse.json(
        { message: 'Please sign in to calculate upgrade price.', data: null },
        { status: 401 }
      )
    }

    const data = await response.json().catch(() => ({ message: 'Invalid response from server', data: null }))

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403) {
        logger.error('[API] Failed to fetch upgrade price:', { status: response.status, targetPlan: normalizedPlan })
      }

      return NextResponse.json(
        { message: data.message || 'Unable to calculate upgrade price.', data: null },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    logger.error('[API] Upgrade price error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { message: 'Unable to calculate upgrade price.', data: null },
      { status: 500 }
    )
  }
}
