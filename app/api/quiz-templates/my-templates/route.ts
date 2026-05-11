import { NextResponse, NextRequest } from 'next/server'
import { getValidTokenOrRefresh } from '@/lib/auth/token'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * GET /api/quiz-templates/my-templates
 * Proxy for: GET /api/v1/quiz-templates/my-templates
 */
export async function GET(request: NextRequest) {
  try {
    const accessToken = await getValidTokenOrRefresh()

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Please sign in to view your templates.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const queryParams = new URLSearchParams()
    ;['page', 'size', 'sortBy', 'sortDir'].forEach((key) => {
      const value = searchParams.get(key)
      if (value) queryParams.set(key, value)
    })

    const response = await fetch(
      `${API_BASE_URL}/api/v1/quiz-templates/my-templates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403) {
        logger.error('[API] Backend error fetching user quiz templates:', {
          status: response.status,
        })
      }

      return NextResponse.json(
        { message: data.message || 'Unable to fetch your quiz templates.' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('[API] Error fetching user quiz templates:', error)
    return NextResponse.json(
      { message: 'Unable to fetch your quiz templates. Please try again later.' },
      { status: 500 }
    )
  }
}
