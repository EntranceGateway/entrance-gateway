import { NextResponse, NextRequest } from 'next/server'
import { getValidTokenOrRefresh } from '@/lib/auth/token'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * GET /api/quiz-attempts/history
 * Proxy for: GET /api/v1/quiz-attempts/history
 */
export async function GET(request: NextRequest) {
  try {
    const accessToken = await getValidTokenOrRefresh()
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Please sign in to access your quiz history.' },
        { status: 401 }
      )
    }

    // Extract potential query params (e.g. page, size) passing through
    const searchParams = request.nextUrl.searchParams
    const queryString = searchParams.toString()
    const targetUrl = `${API_BASE_URL}/api/v1/quiz-attempts/history${queryString ? `?${queryString}` : ''}`

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      // Disable NextJS caching so history is strictly fresh
      cache: 'no-store',
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403) {
        logger.error('[API] Backend error fetching quiz history:', {
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
          { message: data.message || 'Unable to load quiz history. Please try again later.' },
          { status: response.status }
        )
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('[API] Error retrieving quiz history proxy:', error)
    return NextResponse.json(
      { message: 'Network error. Unable to load history at this time.' },
      { status: 500 }
    )
  }
}
