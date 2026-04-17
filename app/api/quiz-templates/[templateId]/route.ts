import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * GET /api/quiz-templates/[templateId]
 * Proxy for: GET /api/v1/quiz-templates/{templateId}
 * Authentication: Optional / Derived from cookie
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params
    
    if (!templateId || !/^[0-9a-fA-F-]+$/.test(templateId)) {
      return NextResponse.json(
        { message: 'Invalid or missing Template ID.' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/quiz-templates/${templateId}`,
      {
        method: 'GET',
        headers,
        cache: 'no-store'
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 404) {
        logger.error('[API] Backend error fetching quiz template details:', {
          status: response.status,
          templateId
        })
      }

      return NextResponse.json(
        { message: data.message || 'Unable to fetch template details.' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('[API] Error fetching quiz template details:', error)
    return NextResponse.json(
      { message: 'Unable to fetch quiz template. Please try again later.' },
      { status: 500 }
    )
  }
}
