import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Call backend API
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/user/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'OTP verification failed' },
        { status: response.status }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
