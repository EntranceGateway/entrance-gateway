import { NextResponse, NextRequest } from 'next/server'
import { getValidTokenOrRefresh } from '@/lib/auth/token'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * POST /api/quiz-attempts/generate/[templateId]
 * Proxy for: POST /api/v1/quiz-attempts/generate/{templateId}
 * Generates a quiz attempt from a predefined template.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const accessToken = await getValidTokenOrRefresh()
    
    // We must await params according to Next.js 15+ API route conventions
    const { templateId } = await params

    if (!accessToken) {
      logger.error('[API] No access token found for quiz generation')
      return NextResponse.json(
        { message: 'Please sign in to generate a quiz' },
        { status: 401 }
      )
    }

    if (!templateId || !/^[0-9a-fA-F-]+$/.test(templateId)) {
      return NextResponse.json(
        { message: 'Invalid or missing Template ID.' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/quiz-attempts/generate/${templateId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        signal: AbortSignal.timeout(15000), // 15s timeout
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403) {
        // Silent error logging - no sensitive data
        logger.error('[API] Backend error generating quiz from template:', {
          status: response.status,
          templateId
        })
      }

      // User-friendly error messages
      if (response.status === 401) {
        return NextResponse.json(
          { message: 'Please sign in to start this quiz.' },
          { status: 401 }
        )
      } else if (response.status === 403) {
        return NextResponse.json(
          { message: 'You do not have permission or an active subscription to start this quiz.' },
          { status: 403 }
        )
      } else if (response.status === 404) {
        return NextResponse.json(
          { message: 'Quiz template not found. It may have been removed.' },
          { status: 404 }
        )
      } else if (response.status === 400) {
        return NextResponse.json(
          { message: data.message || 'Invalid quiz generation request. Please try again.' },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { message: data.message || 'Unable to generate quiz. Please try again later.' },
          { status: response.status }
        )
      }
    }

    // Defensive check for response structure
    if (!data?.data?.attemptId) {
      logger.error('[API] Invalid response structure from backend, missing attemptId')
      return NextResponse.json(
        { message: 'Invalid response from server when generating quiz.' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    // Silent error logging
    logger.error('[API] Error generating quiz attempt:', error)
    
    // Check for timeout errors
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { message: 'Request timeout. Please check your connection and try again.' },
        { status: 408 }
      )
    }
    
    return NextResponse.json(
      { message: 'Unable to generate quiz. Please try again later.' },
      { status: 500 }
    )
  }
}
