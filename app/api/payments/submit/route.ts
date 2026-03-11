import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * POST /api/payments/submit
 * Proxy for: POST /api/v1/payments/pay/{id}/{type}
 * Submits payment with proof for quiz or training
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get form data from request
    const formData = await request.formData()
    const id = formData.get('id') as string
    const type = formData.get('type') as string
    const paymentRequest = formData.get('paymentRequest') as Blob
    const file = formData.get('file') as File

    if (!id || !type || !paymentRequest || !file) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new FormData for backend request
    // Backend expects 'request' not 'paymentRequest'
    const backendFormData = new FormData()
    backendFormData.append('request', paymentRequest)
    backendFormData.append('file', file)

    // Forward request to backend
    const response = await fetch(
      `${API_BASE_URL}/api/v1/payments/pay/${id}/${type}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: backendFormData,
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Payment submission failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error submitting payment:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
