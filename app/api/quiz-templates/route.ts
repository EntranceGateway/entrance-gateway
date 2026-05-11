import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { getValidTokenOrRefresh } from '@/lib/auth/token'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * GET /api/quiz-templates
 * Proxy for: GET /api/v1/quiz-templates
 * Authentication: Optional / Derived from cookie
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '10'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortDir = searchParams.get('sortDir') || 'desc'

    const queryParams = new URLSearchParams({
      page,
      size,
      sortBy,
      sortDir,
    })

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/quiz-templates?${queryParams.toString()}`,
      {
        method: 'GET',
        headers,
        cache: 'no-store',
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      logger.error('[API] Backend error fetching quiz templates:', {
        status: response.status,
      })

      return NextResponse.json(
        { message: data.message || 'Unable to fetch quiz templates. Please try again later.' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('[API] Error fetching quiz templates:', error)
    return NextResponse.json(
      { message: 'Unable to fetch quiz templates. Please try again later.' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/quiz-templates
 * Proxy for: POST /api/v1/quiz-templates
 * Authentication: Required
 */
export async function POST(request: NextRequest) {
  try {
    const accessToken = await getValidTokenOrRefresh()

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Please sign in to create quiz templates.' },
        { status: 401 }
      )
    }

    const payload = await request.json().catch(() => null)

    if (!Array.isArray(payload) || payload.length === 0) {
      return NextResponse.json(
        { message: 'Please provide at least one quiz template to create.' },
        { status: 400 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/quiz-templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403) {
        logger.error('[API] Backend error creating quiz templates:', {
          status: response.status,
        })
      }

      return NextResponse.json(
        { message: data.message || 'Unable to create quiz template.' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('[API] Error creating quiz templates:', error)
    return NextResponse.json(
      { message: 'Unable to create quiz template. Please try again later.' },
      { status: 500 }
    )
  }
}
