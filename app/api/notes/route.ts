import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.entrancegateway.com'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '10'
    const sortBy = searchParams.get('sortBy') || 'title'
    const sortDir = searchParams.get('sortDir') || 'asc'
    const courseId = searchParams.get('courseId')
    const semesterId = searchParams.get('semesterId')

    let url = `${API_BASE_URL}/api/v1/notes?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    
    if (courseId) url += `&courseId=${courseId}`
    if (semesterId) url += `&semesterId=${semesterId}`

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
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { message: 'Internal server error', data: null },
      { status: 500 }
    )
  }
}
