import { NextResponse } from 'next/server'
import { fetchWithAuthRetry } from '@/lib/auth/apiProxy'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

export async function GET() {
  try {
    const { response } = await fetchWithAuthRetry(`${API_BASE_URL}/api/v1/subscriptions/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!response) {
      return NextResponse.json(
        { message: 'Please sign in to view your subscription.', data: null },
        { status: 401 }
      )
    }

    const data = await response.json().catch(() => ({ message: 'Invalid response from server', data: null }))

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403 && response.status !== 404) {
        logger.error('[API] Failed to fetch subscription status:', { status: response.status })
      }

      return NextResponse.json(
        { message: data.message || 'Unable to fetch subscription status.', data: null },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    logger.error('[API] Subscription status error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { message: 'Unable to fetch subscription status.', data: null },
      { status: 500 }
    )
  }
}
