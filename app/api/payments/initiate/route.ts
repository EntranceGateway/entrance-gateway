import { NextResponse } from 'next/server'
import { fetchWithAuthRetry } from '@/lib/auth/apiProxy'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null)

    if (!payload?.moduleId || !payload?.moduleType || !payload?.amount || !payload?.paymentMethod) {
      return NextResponse.json(
        { message: 'Missing required payment initiation fields.' },
        { status: 400 }
      )
    }

    const { response } = await fetchWithAuthRetry(`${API_BASE_URL}/api/v1/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response) {
      return NextResponse.json(
        { message: 'Please sign in to start payment.' },
        { status: 401 }
      )
    }

    const data = await response.json().catch(() => ({ message: 'Invalid response from server' }))

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 402 && response.status !== 403) {
        logger.error('[API] Payment initiation failed:', { status: response.status })
      }

      return NextResponse.json(
        { message: data.message || 'Unable to initiate payment.', data: data.data },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    logger.error('[API] Payment initiation error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { message: 'Unable to initiate payment.' },
      { status: 500 }
    )
  }
}
