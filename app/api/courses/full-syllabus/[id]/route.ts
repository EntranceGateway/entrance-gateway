import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.entrancegateway.com'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const url = `${API_BASE_URL}/api/v1/courses/full-syllabus/${id}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Full syllabus not found', data: null },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching full syllabus:', error)
    return NextResponse.json(
      { message: 'Internal server error', data: null },
      { status: 500 }
    )
  }
}
