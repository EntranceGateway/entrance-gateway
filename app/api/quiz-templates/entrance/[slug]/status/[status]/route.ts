import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * GET /api/quiz-templates/entrance/[slug]/status/[status]
 * Proxy for: GET /api/v1/quiz-templates/entrance/{slug}/status/{status}
 * Authentication: Optional / Derived from cookie
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; status: string }> }
) {
  try {
    const { slug, status } = await params
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '10'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortDir = searchParams.get('sortDir') || 'desc'

    const queryParams = new URLSearchParams({ page, size, sortBy, sortDir })

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
      `${API_BASE_URL}/api/v1/quiz-templates/entrance/${encodeURIComponent(slug)}/status/${encodeURIComponent(status)}?${queryParams.toString()}`,
      {
        method: 'GET',
        headers,
        cache: 'no-store',
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      logger.error('[API] Backend error fetching entrance templates by status:', {
        status: response.status,
        slug,
        templateStatus: status,
      })

      return NextResponse.json(
        { message: data.message || 'Unable to fetch entrance quiz templates. Please try again later.' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('[API] Error fetching entrance templates by status:', error)
    return NextResponse.json(
      { message: 'Unable to fetch entrance quiz templates. Please try again later.' },
      { status: 500 }
    )
  }
}
