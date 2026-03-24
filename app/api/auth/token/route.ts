import { NextResponse } from 'next/server'
import { getValidTokenOrRefresh } from '@/lib/auth/token'

/**
 * GET /api/auth/token
 * Returns a valid access token from httpOnly cookies
 * Auto-refreshes via refresh token if the access token has expired
 */
export async function GET() {
  try {
    const accessToken = await getValidTokenOrRefresh()

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token found' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      accessToken,
    })
  } catch (error) {
    console.error('Token fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
