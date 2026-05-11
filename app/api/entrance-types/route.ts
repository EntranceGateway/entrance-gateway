import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * GET /api/entrance-types
 * Proxy for: GET /api/v1/entrance-types
 * Authentication: Optional / Derived from cookie
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/entrance-types`, {
      method: 'GET',
      headers,
      next: { revalidate: 300 },
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      logger.error('[API] Backend error fetching entrance types:', {
        status: response.status,
      })

      return NextResponse.json(
        { message: data.message || 'Unable to fetch entrance types. Please try again later.' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('[API] Error fetching entrance types:', error)
    return NextResponse.json(
      { message: 'Unable to fetch entrance types. Please try again later.' },
      { status: 500 }
    )
  }
}
