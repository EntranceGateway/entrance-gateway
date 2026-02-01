import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Unauthorized - Please login', data: null },
        { status: 401 }
      )
    }

    // Check if user has an enrollment for this training
    // This endpoint should return the enrollment if it exists
    const response = await fetch(
      `${API_BASE_URL}/api/v1/training-enrollments/user/training/${id}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    )

    if (response.status === 404) {
      // No enrollment found - this is expected for new enrollments
      return NextResponse.json(
        { message: 'No enrollment found', data: null },
        { status: 404 }
      )
    }

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ [API] Check enrollment status failed:', data)
      return NextResponse.json(
        data,
        { status: response.status }
      )
    }

    console.log('✅ [API] Enrollment status retrieved:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [API] Check enrollment status error:', error)
    return NextResponse.json(
      { message: 'Internal server error', data: null },
      { status: 500 }
    )
  }
}
