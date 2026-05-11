import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * GET /api/topics/entrance/[slug]
 * Proxy for: GET /api/v1/topics/entrance/{slug}
 * Authentication: Optional / Derived from cookie
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

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
      `${API_BASE_URL}/api/v1/topics/entrance/${encodeURIComponent(slug)}`,
      {
        method: 'GET',
        headers,
        next: { revalidate: 300 },
      }
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 404) {
        logger.error('[API] Backend error fetching entrance topics:', {
          status: response.status,
          slug,
        })
      }

      return NextResponse.json(
        { message: data?.message || 'Unable to fetch entrance topics.' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('[API] Error fetching entrance topics:', error)
    return NextResponse.json(
      { message: 'Unable to fetch entrance topics. Please try again later.' },
      { status: 500 }
    )
  }
}
