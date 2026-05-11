import { NextResponse, NextRequest } from 'next/server'
import { getValidTokenOrRefresh } from '@/lib/auth/token'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * POST /api/quiz-attempts/generate/custom/entrance/[slug]
 * Proxy for: POST /api/v1/quiz-attempts/generate/custom/entrance/{slug}
 * Generates a custom quiz dynamically for a specific entrance type.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const accessToken = await getValidTokenOrRefresh()

    if (!accessToken) {
      logger.error('[API] No access token found for entrance custom quiz generation')
      return NextResponse.json(
        { message: 'Please sign in to generate a practice quiz.' },
        { status: 401 }
      )
    }

    const payload = await request.json().catch(() => null)

    if (!payload || !payload.totalQuestions || !payload.totalMarks || !payload.durationMinutes) {
      return NextResponse.json(
        { message: 'Invalid custom quiz configuration parameters.' },
        { status: 400 }
      )
    }

    if (payload.totalQuestions > 200) {
      return NextResponse.json(
        { message: 'Total questions cannot exceed 200.' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/quiz-attempts/generate/custom/entrance/${encodeURIComponent(slug)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403) {
        logger.error('[API] Backend error generating entrance custom quiz:', {
          status: response.status,
          slug,
        })
      }

      if (response.status === 401) {
        return NextResponse.json(
          { message: 'Please sign in to start this practice set.' },
          { status: 401 }
        )
      }

      if (response.status === 403) {
        return NextResponse.json(
          { message: 'You do not have permission or an active subscription for this.' },
          { status: 403 }
        )
      }

      return NextResponse.json(
        { message: data.message || 'Invalid constraints. We could not find enough questions matching your criteria.' },
        { status: response.status }
      )
    }

    if (!data?.data?.attemptId) {
      logger.error('[API] Invalid response structure from backend, missing attemptId on entrance custom generation')
      return NextResponse.json(
        { message: 'Invalid response from server when generating custom practice set.' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('[API] Error generating entrance custom quiz attempt:', error)

    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { message: 'Request timeout. Compiling a practice set with those rules took too long.' },
        { status: 408 }
      )
    }

    return NextResponse.json(
      { message: 'Unable to generate practice set. Please try again later.' },
      { status: 500 }
    )
  }
}
