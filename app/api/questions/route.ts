import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '10'
    const sortBy = searchParams.get('sortBy') || 'year'
    const sortDir = searchParams.get('sortDir') || 'desc'
    const courseName = searchParams.get('courseName')
    const affiliation = searchParams.get('affiliation')
    const year = searchParams.get('year')
    const subject = searchParams.get('subject')

    // Build query string
    const queryParams = new URLSearchParams({
      page,
      size,
      sortBy,
      sortDir,
    })

    if (courseName) queryParams.append('courseName', courseName)
    if (affiliation) queryParams.append('affiliation', affiliation)
    if (year) queryParams.append('year', year)
    if (subject) queryParams.append('subject', subject)

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/old-question-collections?${queryParams.toString()}`,
      {
        method: 'GET',
        headers,
        cache: 'no-store',
      }
    )

    const data = await response.json()

    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'No questions found' },
          { status: 404 }
        )
      }
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      return NextResponse.json(
        { error: data.message || 'Failed to fetch old questions' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching old questions:', error)
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Network error: Unable to connect to the server' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
