// Client-side History API calls (for CSR)
// Uses Next.js API proxy routes for cookie-based authentication

import type { UserHistoryResponse, HistoryQueryParams } from '@/types/history.types'

/**
 * Fetch user history with paginated data (Client-side)
 * Uses Next.js API proxy route with cookie-based auth
 */
export async function fetchUserHistory(params?: HistoryQueryParams): Promise<UserHistoryResponse> {
  try {
    const queryParams = new URLSearchParams()
    
    if (params?.enrollmentsPage !== undefined) queryParams.set('enrollmentsPage', params.enrollmentsPage.toString())
    if (params?.enrollmentsSize !== undefined) queryParams.set('enrollmentsSize', params.enrollmentsSize.toString())
    if (params?.quizAttemptsPage !== undefined) queryParams.set('quizAttemptsPage', params.quizAttemptsPage.toString())
    if (params?.quizAttemptsSize !== undefined) queryParams.set('quizAttemptsSize', params.quizAttemptsSize.toString())
    if (params?.purchasesPage !== undefined) queryParams.set('purchasesPage', params.purchasesPage.toString())
    if (params?.purchasesSize !== undefined) queryParams.set('purchasesSize', params.purchasesSize.toString())
    if (params?.admissionsPage !== undefined) queryParams.set('admissionsPage', params.admissionsPage.toString())
    if (params?.admissionsSize !== undefined) queryParams.set('admissionsSize', params.admissionsSize.toString())
    
    // Add include flags to get paginated data
    queryParams.set('includeEnrollments', 'true')
    queryParams.set('includeQuizAttempts', 'true')
    queryParams.set('includePurchases', 'true')
    queryParams.set('includeAdmissions', 'true')

    const queryString = queryParams.toString()
    const url = `/api/user/history${queryString ? `?${queryString}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include', // Include cookies
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED')
      }
      
      const error = await response.json().catch(() => null)
      console.error('[fetchUserHistory] API error:', error?.message || response.status)
      throw new Error(error?.message || 'Failed to fetch user history')
    }

    const data: UserHistoryResponse = await response.json()
    
    // Validate response structure
    if (!data?.data) {
      console.error('[fetchUserHistory] Invalid response structure')
      throw new Error('Invalid response structure')
    }

    return data
  } catch (error) {
    console.error('[fetchUserHistory] Error:', error instanceof Error ? error.message : 'Unknown error')
    // Re-throw with consistent error message
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch user history')
  }
}
