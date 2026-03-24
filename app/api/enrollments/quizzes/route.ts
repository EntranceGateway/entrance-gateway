import { NextResponse } from 'next/server'
import { getValidTokenOrRefresh } from '@/lib/auth/token'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * GET /api/enrollments/quizzes
 * Proxy for: GET /api/v1/purchases/me/quizzes
 * Fetches quiz purchases for authenticated user
 */
export async function GET() {
  try {
    const accessToken = await getValidTokenOrRefresh()

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Not authenticated', data: [] },
        { status: 200 } // Return 200 with empty data instead of 401
      )
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/purchases/me/quizzes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      // Return empty data on error instead of propagating error
      return NextResponse.json(
        { message: data.message || 'Failed to fetch quiz purchases', data: [] },
        { status: 200 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching quiz purchases:', error)
    return NextResponse.json(
      { message: 'Internal server error', data: [] },
      { status: 200 }
    )
  }
}
