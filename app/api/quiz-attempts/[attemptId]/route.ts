import { NextResponse, NextRequest } from 'next/server'
import { getValidTokenOrRefresh } from '@/lib/auth/token'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * GET /api/quiz-attempts/[attemptId]
 * Proxy for: GET /api/v1/quiz-attempts/{id}
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const accessToken = await getValidTokenOrRefresh()
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Please sign in to access this quiz attempt.' },
        { status: 401 }
      )
    }

    const { attemptId } = await params
    if (!attemptId || isNaN(parseInt(attemptId, 10))) {
      return NextResponse.json(
        { message: 'Invalid or missing Attempt ID.' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/quiz-attempts/${attemptId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403 && response.status !== 404) {
        logger.error('[API] Backend error fetching custom quiz attempt:', {
          status: response.status,
          attemptId: attemptId,
        })
      }

      if (response.status === 401) {
        return NextResponse.json(
          { message: 'Unauthorized. Please sign in again.' },
          { status: 401 }
        )
      } else if (response.status === 403) {
        return NextResponse.json(
          { message: 'You do not have permission to access this practice set.' },
          { status: 403 }
        )
      } else if (response.status === 404) {
        return NextResponse.json(
          { message: 'Practice set attempt not found or deleted.' },
          { status: 404 }
        )
      } else {
        return NextResponse.json(
          { message: data.message || 'Unable to retrieve quiz attempt. Please try again later.' },
          { status: response.status }
        )
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('[API] Error retrieving attempt proxy:', error)
    return NextResponse.json(
      { message: 'Unable to connect to practice server. Please try again later.' },
      { status: 500 }
    )
  }
}
