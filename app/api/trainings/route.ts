import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.entrancegateway.com'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '10'
    const sortBy = searchParams.get('sortBy') || 'trainingStatus'
    const sortDir = searchParams.get('sortDir') || 'asc'
    const trainingCategory = searchParams.get('trainingCategory')
    const trainingType = searchParams.get('trainingType')
    const trainingStatus = searchParams.get('trainingStatus')

    let url = `${API_BASE_URL}/api/v1/trainings?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    
    if (trainingCategory) url += `&trainingCategory=${trainingCategory}`
    if (trainingType) url += `&trainingType=${trainingType}`
    if (trainingStatus) url += `&trainingStatus=${trainingStatus}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch trainings', data: null },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching trainings:', error)
    return NextResponse.json(
      { message: 'Internal server error', data: null },
      { status: 500 }
    )
  }
}
