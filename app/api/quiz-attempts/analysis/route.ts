import { NextResponse, NextRequest } from 'next/server'
import { getValidTokenOrRefresh } from '@/lib/auth/token'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * GET /api/quiz-attempts/analysis
 * Proxy for: GET /api/v1/quiz-attempts/analysis
 */
export async function GET(request: NextRequest) {
  try {
    const accessToken = await getValidTokenOrRefresh()
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Please sign in to access your topic analytics.' },
        { status: 401 }
      )
    }

    const targetUrl = `${API_BASE_URL}/api/v1/quiz-attempts/analysis`

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      // Disable NextJS caching so analytics are constantly fresh as soon as a quiz is submitted
      cache: 'no-store',
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403) {
        logger.error('[API] Backend error fetching category analysis:', {
          status: response.status,
          targetUrl
        })
      }

      if (response.status === 401) {
        return NextResponse.json(
          { message: 'Unauthorized. Please sign in again.' },
          { status: 401 }
        )
      } else {
        return NextResponse.json(
          { message: data.message || 'Unable to load topic analytics. Please try again later.' },
          { status: response.status }
        )
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('[API] Error retrieving category analysis proxy:', error)
    return NextResponse.json(
      { message: 'Network error. Unable to load analysis at this time.' },
      { status: 500 }
    )
  }
}
