import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

export async function POST(
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

    // Get Idempotency-Key from request headers
    const idempotencyKey = request.headers.get('Idempotency-Key')

    if (!idempotencyKey) {
      return NextResponse.json(
        { message: 'Idempotency-Key header is required', data: null },
        { status: 400 }
      )
    }

    // Check if this is initial enrollment (no body) or payment submission (with FormData)
    const contentType = request.headers.get('content-type') || ''
    const hasFormData = contentType.includes('multipart/form-data')

    let body: FormData | undefined = undefined
    
    if (hasFormData) {
      // Get FormData from request for payment submission
      body = await request.formData()
    }

    // Call backend API
    const response = await fetch(
      `${API_BASE_URL}/api/v1/training-enrollments/${id}/enroll`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'Idempotency-Key': idempotencyKey,
          // Don't set Content-Type - fetch will set it automatically for FormData
        },
        body: body,
        cache: 'no-store',
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ [API] Training enrollment failed:', data)
      return NextResponse.json(
        data,
        { status: response.status }
      )
    }

    console.log('✅ [API] Training enrollment successful:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [API] Training enrollment error:', error)
    return NextResponse.json(
      { message: 'Internal server error', data: null },
      { status: 500 }
    )
  }
}
