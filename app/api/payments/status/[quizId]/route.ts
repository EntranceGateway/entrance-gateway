import { NextResponse } from 'next/server'
import { getValidTokenOrRefresh } from '@/lib/auth/token'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * GET /api/payments/status/{quizId}
 * Proxy for: GET /api/v1/purchases/quizzes/{quizId}/status
 * Checks purchase status for a quiz
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params
    const accessToken = await getValidTokenOrRefresh()

    if (!accessToken) {
      // Return NOT_PURCHASED status for unauthenticated users
      return NextResponse.json({
        message: 'Quiz purchase status',
        data: {
          status: 'NOT_PURCHASED',
          purchaseId: null,
          purchaseDate: null,
          amountPaid: null,
        },
      })
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/purchases/quizzes/${quizId}/status`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      // Return NOT_PURCHASED on error
      return NextResponse.json({
        message: 'Quiz purchase status',
        data: {
          status: 'NOT_PURCHASED',
          purchaseId: null,
          purchaseDate: null,
          amountPaid: null,
        },
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error checking purchase status:', error)
    // Return NOT_PURCHASED on error
    return NextResponse.json({
      message: 'Quiz purchase status',
      data: {
        status: 'NOT_PURCHASED',
        purchaseId: null,
        purchaseDate: null,
        amountPaid: null,
      },
    })
  }
}
