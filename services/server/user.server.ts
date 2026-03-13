// Server-side User API calls (for SSR)
// Uses cookies for authentication

import { cookies } from 'next/headers'
import type { UserResponse } from '@/types/user.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.entrancegateway.com'

/**
 * Fetch user profile on server-side
 * Uses httpOnly cookies for authentication
 */
export async function getUserProfile(): Promise<UserResponse | null> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      console.log('⚠️ No access token found in cookies')
      return null
    }

    console.log('🔍 [SSR] Fetching user profile...')

    const response = await fetch(`${API_BASE_URL}/api/v1/user/me`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store', // Don't cache user data
    })

    if (!response.ok) {
      console.error('❌ [SSR] Failed to fetch user profile:', response.status)
      return null
    }

    const data = await response.json()
    console.log('✅ [SSR] User profile fetched successfully')
    return data
  } catch (error) {
    console.error('❌ [SSR] Error fetching user profile:', error)
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
    console.log('🔍 [SSR] Fetching full user profile with pagination...')
    
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      console.log('⚠️ [SSR] No access token found for full profile')
      return null
    }

    const queryParams = new URLSearchParams()
    
    // Add pagination parameters
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
    const url = `${API_BASE_URL}/api/v1/user/me/full${queryString ? `?${queryString}` : ''}`
    
    console.log('🌐 [SSR] Full profile URL:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('❌ [SSR] Failed to fetch full user profile:', response.status, response.statusText)
      return null
    }

    const data = await response.json()
    console.log('✅ [SSR] Full user profile fetched successfully')
    console.log('📊 [SSR] Profile data structure:', {
      hasData: !!data.data,
      isPaginated: data.data?.isPaginated,
      totalEnrollments: data.data?.totalEnrollments,
      totalQuizAttempts: data.data?.totalQuizAttempts,
    })
    
    return data
  } catch (error) {
    console.error('❌ [SSR] Error fetching full user profile:', error)
    return null
  }
}
