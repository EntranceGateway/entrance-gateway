import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * GET /api/topics/all
 * Proxy for: GET /api/v1/topics/all
 */
export async function GET(request: NextRequest) {
  try {
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
      `${API_BASE_URL}/api/v1/topics/all`,
      {
        method: 'GET',
        headers,
        // Using standard short cache to prevent beating the backend DB heavily if many users visit config forms
        next: { revalidate: 300 } 
      }
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 404) {
        logger.error('[API] Backend error fetching topics:', {
          status: response.status
        })
      }

      return NextResponse.json(
        { message: data?.message || 'Unable to fetch topics.' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('[API] Error fetching topics:', error)
    return NextResponse.json(
      { message: 'Unable to fetch system topics. Please try again later.' },
      { status: 500 }
    )
  }
}
