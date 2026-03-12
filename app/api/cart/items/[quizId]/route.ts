import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * POST /api/cart/items/[quizId]
 * Proxy for: POST /api/v1/cart/items/{quizId}
 * Add quiz to cart
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params

    // Validate quiz ID
    const quizIdNum = parseInt(quizId)
    if (isNaN(quizIdNum) || quizIdNum <= 0) {
      return NextResponse.json(
        { message: 'Invalid quiz ID' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Please sign in to add items to cart' },
        { status: 401 }
      )
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/cart/items/${quizIdNum}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to add item to cart' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[API] Add to cart error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/cart/items/[quizId]
 * Proxy for: DELETE /api/v1/cart/items/{quizId}
 * Remove quiz from cart
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params

    // Validate quiz ID
    const quizIdNum = parseInt(quizId)
    if (isNaN(quizIdNum) || quizIdNum <= 0) {
      return NextResponse.json(
        { message: 'Invalid quiz ID' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Please sign in to remove items from cart' },
        { status: 401 }
      )
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/cart/items/${quizIdNum}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to remove item from cart' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[API] Remove from cart error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
