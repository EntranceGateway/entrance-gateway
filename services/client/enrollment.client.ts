import type { MyPurchasesResponse } from '@/types/enrollment.types'
import type { TrainingEnrollmentsListResponse } from '@/types/trainings.types'

/**
 * Fetch all quiz purchases for the authenticated user
 * Uses Next.js API proxy route: GET /api/enrollments/quizzes
 * Backend endpoint: GET /api/v1/purchases/me/quizzes
 */
export async function fetchMyQuizPurchases(): Promise<MyPurchasesResponse> {
  try {
    const response = await fetch('/api/enrollments/quizzes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json()

    // Return data even if not authenticated (will have empty array)
    return data
  } catch (error) {
    // Silent error handling - return empty array
    return {
      message: 'Failed to load purchases',
      data: [],
    }
  }
}

/**
 * Fetch all training enrollments for the authenticated user
 * Uses Next.js API proxy route: GET /api/enrollments/trainings
 * Backend endpoint: GET /api/v1/training-enrollments/me
 */
export async function fetchMyTrainingEnrollments(): Promise<TrainingEnrollmentsListResponse> {
  try {
    const response = await fetch('/api/enrollments/trainings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json()

    // Return data even if not authenticated (will have empty array)
    return data
  } catch (error) {
    // Silent error handling - return empty array
    return {
      message: 'Failed to load enrollments',
      data: [],
    }
  }
}
