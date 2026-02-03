import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // IMPORTANT: In Next.js 15, params must be awaited
    const { id } = await params
    
    // Validate training ID
    const trainingId = parseInt(id)
    
    if (isNaN(trainingId) || trainingId <= 0) {
      return NextResponse.json(
        { message: 'Invalid training ID' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get idempotency key from headers
    const idempotencyKey = request.headers.get('Idempotency-Key')
    
    if (!idempotencyKey) {
      return NextResponse.json(
        { message: 'Idempotency-Key header is required' },
        { status: 400 }
      )
    }

    // Get the FormData from the request
    const formData = await request.formData()

    // Forward the request to the backend
    const backendUrl = `${API_BASE_URL}/api/v1/training-enrollments/${trainingId}/enroll-with-payment`
    
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Idempotency-Key': idempotencyKey,
        // Don't set Content-Type - fetch will set it with boundary for multipart/form-data
      },
      body: formData,
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to enroll with payment' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(data, { status: backendResponse.status })
  } catch (error) {
    console.error('[API] Enrollment error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
