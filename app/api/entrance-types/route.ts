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

    const endpointCandidates = [
      `${API_BASE_URL}/api/v1/entrance-types`,
    ]

    let response: Response | null = null
    let data: unknown = null

    for (const endpoint of endpointCandidates) {
      response = await fetch(endpoint, {
        method: 'GET',
        headers,
        next: { revalidate: 300 },
      })

      data = await response.json().catch(() => ({}))

      if (response.ok) break

      if (response.status !== 404) {
        break
      }
    }

    if (!response) {
      return NextResponse.json(
        { message: 'Unable to fetch entrance types. Please try again later.' },
        { status: 500 }
      )
    }

    if (!response.ok) {
      logger.error('[API] Backend error fetching entrance types:', {
        status: response.status,
      })

      return NextResponse.json(
        { message: (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') ? data.message : 'Unable to fetch entrance types. Please try again later.' },
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
