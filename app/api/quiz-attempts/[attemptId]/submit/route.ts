import { NextResponse, NextRequest } from 'next/server'
import { getValidTokenOrRefresh } from '@/lib/auth/token'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * POST /api/quiz-attempts/[attemptId]/submit
 * Proxy for: POST /api/v1/quiz-attempts/{attemptId}/submit
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const accessToken = await getValidTokenOrRefresh()
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Please sign in to submit your quiz attempt.' },
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

    const payload = await request.json().catch(() => null)
    if (!payload || !Array.isArray(payload.questionAnswers)) {
      return NextResponse.json(
        { message: 'Invalid submission format. Answers are required.' },
        { status: 400 }
      )
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    let response
    try {
      response = await fetch(
        `${API_BASE_URL}/api/v1/quiz-attempts/${attemptId}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        }
      )
    } finally {
      clearTimeout(timeoutId)
    }

    const data = await response.json().catch(() => ({ message: 'Invalid JSON response from server' }))

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403) {
        logger.error('[API] Backend error submitting custom quiz attempt:', {
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
          { message: 'You do not have permission to submit this attempt.' },
          { status: 403 }
        )
      } else if (response.status === 404) {
        return NextResponse.json(
          { message: 'Attempt not found or expired.' },
          { status: 404 }
        )
      } else if (response.status === 400) {
        return NextResponse.json(
          { message: data.message || 'This quiz attempt has already been submitted or invalid.' },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { message: data.message || 'Unable to submit quiz. Please try again later.' },
          { status: response.status }
        )
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('[API] Error submitting attempt proxy:', error)
    return NextResponse.json(
      { message: 'Unable to connect to grading server. Please try again later.' },
      { status: 500 }
    )
  }
}
