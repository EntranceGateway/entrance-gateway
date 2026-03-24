import { NextRequest, NextResponse } from 'next/server'
import { getValidTokenOrRefresh } from '@/lib/auth/token'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * POST /api/trainings/[id]/enroll-free
 * Proxy for: POST /api/v1/training-enrollments/{trainingId}/enroll-free
 * Enrolls user in a free training
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Validate training ID
    const trainingId = parseInt(id)
    
    if (isNaN(trainingId) || trainingId <= 0) {
      return NextResponse.json(
        { message: 'Invalid training ID' },
        { status: 400 }
      )
    }

    const accessToken = await getValidTokenOrRefresh()

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Please sign in to enroll in this training' },
        { status: 401 }
      )
    }

    // Get idempotency key from headers (sent by client)
    const idempotencyKey = request.headers.get('Idempotency-Key')
    
    if (!idempotencyKey) {
      return NextResponse.json(
        { message: 'Idempotency-Key header is required' },
        { status: 400 }
      )
    }

    // Forward request to backend
    const response = await fetch(
      `${API_BASE_URL}/api/v1/training-enrollments/${trainingId}/enroll-free`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Idempotency-Key': idempotencyKey,
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to enroll in training' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[API] Free enrollment error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
