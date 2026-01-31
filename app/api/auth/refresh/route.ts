import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token found' },
        { status: 401 }
      )
    }
    
    // Call backend API
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      // Clear cookies on refresh failure
      cookieStore.delete('accessToken')
      cookieStore.delete('refreshToken')
      cookieStore.delete('userId')
      
      return NextResponse.json(
        { error: data.message || 'Token refresh failed' },
        { status: response.status }
      )
    }
    
    // Update cookies with new tokens
    cookieStore.set('accessToken', data.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.data.expiresIn,
      path: '/',
    })
    
    cookieStore.set('refreshToken', data.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    
    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
