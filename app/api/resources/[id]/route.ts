import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.entrancegateway.com'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Decode the filename from URL encoding
    const fileName = decodeURIComponent(id)
    
    // Build the backend URL - encode the filename for the backend request
    const url = `${API_BASE_URL}/api/v1/resources/${encodeURIComponent(fileName)}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Resource not found', data: null },
        { status: response.status }
      )
    }

    // Get the file content
    const fileBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'application/pdf'

    // Return the file with proper headers (no X-Frame-Options)
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error fetching resource:', error)
    return NextResponse.json(
      { message: 'Internal server error', data: null },
      { status: 500 }
    )
  }
}
