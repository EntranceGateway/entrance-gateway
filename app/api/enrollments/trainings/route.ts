import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * GET /api/enrollments/trainings
 * Proxy for: GET /api/v1/training-enrollments/my-enrollments
 * Fetches training enrollments for authenticated user
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Not authenticated', data: [] },
        { status: 200 } // Return 200 with empty data instead of 401
      )
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/training-enrollments/my-enrollments`, {
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
        { message: data.message || 'Failed to fetch training enrollments', data: [] },
        { status: 200 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching training enrollments:', error)
    return NextResponse.json(
      { message: 'Internal server error', data: [] },
      { status: 200 }
    )
  }
}
