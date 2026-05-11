import { NextRequest, NextResponse } from 'next/server'
import { getValidTokenOrRefresh } from '@/lib/auth/token'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; type: string }> }
) {
  try {
    const { id, type } = await params
    const accessToken = await getValidTokenOrRefresh()

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Unauthorized - Please login', data: null },
        { status: 401 }
      )
    }

    // Validate type parameter
    if (type !== 'QUIZ' && type !== 'TRAINING' && type !== 'SUBSCRIPTION') {
      return NextResponse.json(
        { message: 'Invalid payment type. Must be QUIZ, TRAINING, or SUBSCRIPTION', data: null },
        { status: 400 }
      )
    }

    // Get FormData from request and normalize legacy/current field names
    const incomingFormData = await request.formData()
    const requestBlob = incomingFormData.get('request') || incomingFormData.get('paymentRequest')
    const file = incomingFormData.get('file')

    if (!requestBlob) {
      return NextResponse.json(
        { message: 'Missing payment request payload', data: null },
        { status: 400 }
      )
    }

    const formData = new FormData()
    formData.append('request', requestBlob)
    if (file instanceof File) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
      const maxFileSizeBytes = 5 * 1024 * 1024

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { message: 'Receipt must be a JPG, PNG, WEBP, or PDF file.', data: null },
          { status: 400 }
        )
      }

      if (file.size > maxFileSizeBytes) {
        return NextResponse.json(
          { message: 'Receipt file must be 5MB or smaller.', data: null },
          { status: 400 }
        )
      }

      formData.append('file', file)
    } else if (file !== null) {
      return NextResponse.json(
        { message: 'Invalid receipt file.', data: null },
        { status: 400 }
      )
    }

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
