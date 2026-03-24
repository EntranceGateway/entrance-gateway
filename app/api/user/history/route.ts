import { NextRequest, NextResponse } from 'next/server'
import { getValidTokenOrRefresh } from '@/lib/auth/token'

export async function GET(request: NextRequest) {
  try {
    const accessToken = await getValidTokenOrRefresh()

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const queryString = searchParams.toString()

    const response = await fetch(
      `https://api.entrancegateway.com/api/v1/user/me/full${queryString ? `?${queryString}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      return NextResponse.json(
        { message: data?.message || 'Failed to fetch user history' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Validate response structure
    if (!data?.data) {
      return NextResponse.json(
        { message: 'Invalid response structure' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    // Silent error - log but return generic message
    console.error('Error fetching user history:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
