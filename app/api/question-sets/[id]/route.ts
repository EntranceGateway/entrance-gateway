import { NextResponse } from 'next/server'
import { getValidTokenOrRefresh } from '@/lib/auth/token'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * GET /api/question-sets/[id]
 * Proxy for: GET /api/v1/questions/set/{questionSetId}
 * Fetches all questions for a specific question set
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    // Validate ID format
    const questionSetId = parseInt(id, 10)
    if (isNaN(questionSetId)) {
      logger.error('[API] Invalid question set ID format:', id)
      return NextResponse.json(
        { message: 'Invalid quiz identifier' },
        { status: 400 }
      )
    }

    const accessToken = await getValidTokenOrRefresh()

    if (!accessToken) {
      logger.error('[API] No access token found for question set:', id)
      return NextResponse.json(
        { message: 'Please sign in to access this quiz' },
        { status: 401 }
      )
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/questions/set/${questionSetId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )

    const data = await response.json()

    if (!response.ok) {
      // Silent error logging - don't expose internal details
      logger.error('[API] Backend error fetching question set:', {
        questionSetId,
        status: response.status,
        error: data
      })
      
      // User-friendly error messages
      if (response.status === 401) {
        return NextResponse.json(
          { message: 'Please sign in to access this quiz' },
          { status: 401 }
        )
      } else if (response.status === 403) {
        return NextResponse.json(
          { message: 'You do not have access to this quiz. Please purchase it first.' },
          { status: 403 }
        )
      } else if (response.status === 404) {
        return NextResponse.json(
          { message: 'Quiz not found. It may have been removed.' },
          { status: 404 }
        )
      } else {
        return NextResponse.json(
          { message: data.message || 'Unable to load quiz questions' },
          { status: response.status }
        )
      }
    }

    // Defensive check for response structure
    if (!data?.data) {
      logger.error('[API] Invalid response structure from backend:', data)
      return NextResponse.json(
        { message: 'Invalid response from server' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    // Silent error logging - don't expose internal details
    logger.error('[API] Error in question-sets route:', error)
    
    return NextResponse.json(
      { message: 'Unable to load quiz. Please try again later.' },
      { status: 500 }
    )
  }
}
