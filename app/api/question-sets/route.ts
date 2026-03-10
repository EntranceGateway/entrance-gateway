import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '10'
    const sortBy = searchParams.get('sortBy') || 'setName'
    const sortDir = searchParams.get('sortDir') || 'asc'

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/question-sets?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching question sets:', error)
    return NextResponse.json(
      { message: 'Failed to fetch question sets', error: String(error) },
      { status: 500 }
    )
  }
}
