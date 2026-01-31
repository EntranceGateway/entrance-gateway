import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.entrancegateway.com'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseName = searchParams.get('courseName')
    const semester = searchParams.get('semester')
    const affiliation = searchParams.get('affiliation')

    if (!courseName || !semester || !affiliation) {
      return NextResponse.json(
        { message: 'Missing required parameters', data: null },
        { status: 400 }
      )
    }

    const url = `${API_BASE_URL}/api/v1/notes/by-course-semester-affiliation?courseName=${courseName}&semester=${semester}&affiliation=${affiliation}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch notes', data: null },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching notes by filters:', error)
    return NextResponse.json(
      { message: 'Internal server error', data: null },
      { status: 500 }
    )
  }
}
