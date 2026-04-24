// Server-side User API calls (for SSR)
// Uses cookies for authentication

import type { UserResponse } from '@/types/user.types'
import { getValidTokenOrRefresh } from '@/lib/auth/token'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.entrancegateway.com'

/**
 * Fetch user profile on server-side
 * Uses httpOnly cookies for authentication
 */
export async function getUserProfile(): Promise<UserResponse | null> {
  try {
    const accessToken = await getValidTokenOrRefresh()

    if (!accessToken) {
      return null
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/user/me`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch {
    return null
  }
}

/**
 * Fetch full user profile with paginated history on server-side
 * Uses httpOnly cookies for authentication
 */
export async function getUserProfileFull(params?: {
  enrollmentsPage?: number
  enrollmentsSize?: number
  quizAttemptsPage?: number
  quizAttemptsSize?: number
  purchasesPage?: number
  purchasesSize?: number
  admissionsPage?: number
  admissionsSize?: number
}): Promise<import('@/types/user.types').UserProfileFullResponse | null> {
  try {
    const accessToken = await getValidTokenOrRefresh()

    if (!accessToken) {
      return null
    }

    const queryParams = new URLSearchParams()

    if (params?.enrollmentsPage !== undefined) queryParams.set('enrollmentsPage', params.enrollmentsPage.toString())
    if (params?.enrollmentsSize !== undefined) queryParams.set('enrollmentsSize', params.enrollmentsSize.toString())
    if (params?.quizAttemptsPage !== undefined) queryParams.set('quizAttemptsPage', params.quizAttemptsPage.toString())
    if (params?.quizAttemptsSize !== undefined) queryParams.set('quizAttemptsSize', params.quizAttemptsSize.toString())
    if (params?.purchasesPage !== undefined) queryParams.set('purchasesPage', params.purchasesPage.toString())
    if (params?.purchasesSize !== undefined) queryParams.set('purchasesSize', params.purchasesSize.toString())
    if (params?.admissionsPage !== undefined) queryParams.set('admissionsPage', params.admissionsPage.toString())
    if (params?.admissionsSize !== undefined) queryParams.set('admissionsSize', params.admissionsSize.toString())

    queryParams.set('includeEnrollments', 'true')
    queryParams.set('includeQuizAttempts', 'true')
    queryParams.set('includePurchases', 'true')
    queryParams.set('includeAdmissions', 'true')

    const queryString = queryParams.toString()
    const url = `${API_BASE_URL}/api/v1/user/me/full${queryString ? `?${queryString}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch {
    return null
  }
}
