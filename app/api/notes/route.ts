import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '')

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '10'
    const sortBy = searchParams.get('sortBy') || 'noteName'
    const sortDir = searchParams.get('sortDir') || 'asc'
    const query = new URLSearchParams({ page, size, sortBy, sortDir })
    for (const key of ['courseName', 'semester', 'affiliation']) {
      const value = searchParams.get(key)
      if (value) query.set(key, value)
    }
    const url = `${API_BASE_URL}/api/v1/notes?${query}`

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
