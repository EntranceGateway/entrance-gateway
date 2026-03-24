import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getValidTokenOrRefresh } from '@/lib/auth/token'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.entrancegateway.com'

export async function GET(request: NextRequest) {
  try {
    const accessToken = await getValidTokenOrRefresh()

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Unauthorized', data: null },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/user/me`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch user profile' }))
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { message: 'Internal server error', data: null },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = await getValidTokenOrRefresh()
    const userId = cookieStore.get('userId')?.value

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Unauthorized', data: null },
        { status: 401 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID not found', data: null },
        { status: 400 }
      )
    }

    const body = await request.json()

    console.log(`📤 Updating profile for user ${userId}:`, body)

    // Use the correct endpoint: PUT /api/v1/user/{id}/update-profile
    const response = await fetch(`${API_BASE_URL}/api/v1/user/${userId}/update-profile`, {
      method: 'PUT',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update user profile' }))
      console.error('❌ Update failed:', error)
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    console.log('✅ Profile updated successfully')
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { message: 'Internal server error', data: null },
      { status: 500 }
    )
  }
}
