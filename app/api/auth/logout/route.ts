import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

export async function POST() {
  try {
    const cookieStore = await cookies()

    // Get refresh token before clearing cookies to invalidate on backend
    const refreshToken = cookieStore.get('refreshToken')?.value

    // Call backend to invalidate the refresh token (session invalidation)
    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`,
          },
        })
      } catch (backendError) {
        // Log but don't fail - still clear local cookies
        console.error('Backend logout failed:', backendError)
      }
    }

    // Clear all auth-related cookies
    const cookiesToDelete = [
      'accessToken',
      'refreshToken',
      'userId',
    ]

    cookiesToDelete.forEach(cookieName => {
      cookieStore.delete(cookieName)
    })

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
