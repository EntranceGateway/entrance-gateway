// Server-side History API calls (for SSR)
// Uses cookies for authentication

import { cookies } from 'next/headers'
import type { UserHistoryResponse, HistoryQueryParams } from '@/types/history.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.entrancegateway.com'

/**
 * Fetch user history with paginated data on server-side
 * Uses httpOnly cookies for authentication
 */
export async function getUserHistory(params?: HistoryQueryParams): Promise<UserHistoryResponse | null> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      console.error('[getUserHistory] No access token found')
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
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error(`[getUserHistory] API error: ${response.status}`)
      return null
    }

    const data = await response.json()
    
    if (!data?.data) {
      console.error('[getUserHistory] Invalid response structure')
      return null
    }

    return data
  } catch (error) {
    console.error('[getUserHistory] Error:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}
