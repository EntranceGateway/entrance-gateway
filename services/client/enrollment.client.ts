import { apiClient } from '../api/client'
import type { MyPurchasesResponse } from '@/types/enrollment.types'

/**
 * Fetch all quiz purchases for the authenticated user
 * Endpoint: GET /api/v1/purchases/me/quizzes
 */
export async function fetchMyQuizPurchases(): Promise<MyPurchasesResponse> {
  try {
    // Get access token from cookie
    const accessToken = getAccessToken()
    
    return await apiClient<MyPurchasesResponse>('/api/v1/purchases/me/quizzes', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
  } catch (error) {
    console.error('Failed to fetch quiz purchases:', error)
    // Return empty array on error
    return {
      message: 'Failed to load purchases',
      data: [],
    }
  }
}

/**
 * Get access token from cookie (client-side)
 */
function getAccessToken(): string | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  const tokenCookie = cookies.find(c => c.trim().startsWith('accessToken='))
  
  if (!tokenCookie) return null
  
  return tokenCookie.split('=')[1]
}
