import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/plans`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 1800 },
    })

    const data = await response.json().catch(() => ({ message: 'Invalid response from server', data: [] }))

    if (!response.ok) {
      logger.error('[API] Failed to fetch subscription plans:', { status: response.status })
      return NextResponse.json(
        { message: data.message || 'Unable to fetch subscription plans.', data: [] },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    logger.error('[API] Subscription plans error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { message: 'Unable to fetch subscription plans.', data: [] },
      { status: 500 }
    )
  }
}
