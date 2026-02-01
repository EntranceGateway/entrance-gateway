import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; type: string }> }
) {
  try {
    const { id, type } = await params
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Unauthorized - Please login', data: null },
        { status: 401 }
      )
    }

    // Validate type parameter
    if (type !== 'QUIZ' && type !== 'TRAINING') {
      return NextResponse.json(
        { message: 'Invalid payment type. Must be QUIZ or TRAINING', data: null },
        { status: 400 }
      )
    }

    // Get FormData from request
    const formData = await request.formData()

    // Call backend API with multipart/form-data
    const response = await fetch(
      `${API_BASE_URL}/api/v1/payments/pay/${id}/${type}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          // Don't set Content-Type - fetch will set it automatically for FormData
        },
        body: formData,
        cache: 'no-store',
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ [API] Payment submission failed:', data)
      return NextResponse.json(
        data,
        { status: response.status }
      )
    }

    console.log('✅ [API] Payment submitted successfully:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [API] Payment submission error:', error)
    return NextResponse.json(
      { message: 'Internal server error', data: null },
      { status: 500 }
    )
  }
}
