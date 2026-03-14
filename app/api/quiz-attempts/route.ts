import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * POST /api/quiz-attempts
 * Proxy for: POST /api/v1/quiz-attempts
 * Submits a completed quiz attempt with answers
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      logger.error('[API] No access token found for quiz attempt submission')
      return NextResponse.json(
        { message: 'Please sign in to submit your quiz' },
        { status: 401 }
      )
    }

    let body: any
    try {
      body = await request.json()
    } catch (e) {
      logger.error('[API] Invalid JSON payload for quiz attempt:', e)
      return NextResponse.json(
        { message: 'Invalid request format. Please try again.' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (typeof body.questionSetId !== 'number' || body.questionSetId < 0) {
      logger.error('[API] Invalid questionSetId in quiz attempt')
      return NextResponse.json(
        { message: 'Invalid quiz data. Please try again.' },
        { status: 400 }
      )
    }
    
    if (!Array.isArray(body.questionAnswers)) {
      logger.error('[API] Invalid questionAnswers format in quiz attempt')
      return NextResponse.json(
        { message: 'Invalid quiz data. Please try again.' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/quiz-attempts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      // Silent error logging - no sensitive data
      logger.error('[API] Backend error submitting quiz attempt:', {
        status: response.status,
        questionSetId: body.questionSetId
      })

      // User-friendly error messages
      if (response.status === 401) {
        return NextResponse.json(
          { message: 'Please sign in to submit your quiz' },
          { status: 401 }
        )
      } else if (response.status === 403) {
        return NextResponse.json(
          { message: 'You do not have permission to submit this quiz' },
          { status: 403 }
        )
      } else if (response.status === 404) {
        return NextResponse.json(
          { message: 'Quiz not found. It may have been removed.' },
          { status: 404 }
        )
      } else if (response.status === 400) {
        return NextResponse.json(
          { message: data.message || 'Invalid quiz submission. Please try again.' },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { message: data.message || 'Unable to submit quiz. Please try again later.' },
          { status: response.status }
        )
      }
    }

    // Defensive check for response structure
    if (!data?.data) {
      logger.error('[API] Invalid response structure from backend')
      return NextResponse.json(
        { message: 'Invalid response from server' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    // Silent error logging - don't expose internal details
    logger.error('[API] Error submitting quiz attempt:', error)
    
    // Check for timeout errors
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { message: 'Request timeout. Please check your connection and try again.' },
        { status: 408 }
      )
    }
    
    return NextResponse.json(
      { message: 'Unable to submit quiz. Please try again later.' },
      { status: 500 }
    )
  }
}
