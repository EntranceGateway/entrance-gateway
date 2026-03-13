// Client-side User API calls (for CSR)
// Uses Next.js API proxy routes for cookie-based authentication

import type { 
  UserResponse, 
  UpdateUserRequest, 
  UpdateUserResponse,
  UserProfileFullResponse,
  UserProfileQueryParams
} from '@/types/user.types'

/**
 * Fetch current user profile (Client-side)
 * Uses Next.js API proxy route with cookie-based auth
 */
export async function fetchUserProfile(): Promise<UserResponse> {
  const response = await fetch('/api/user/me', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    credentials: 'include', // Include cookies
  })

  if (!response.ok) {
    // If unauthorized, silently throw (user not logged in - expected)
    if (response.status === 401) {
      throw new Error('UNAUTHORIZED')
    }
    
    // For other errors, silently fail (don't log to console)
    const error = await response.json().catch(() => ({ message: 'Failed to fetch user profile' }))
    throw new Error(error.message || 'Failed to fetch user profile')
  }

  return response.json()
}

/**
 * Fetch full user profile with paginated history (Client-side)
 * Uses Next.js API proxy route with cookie-based auth
 */
export async function fetchUserProfileFull(params?: UserProfileQueryParams): Promise<UserProfileFullResponse> {
  const queryParams = new URLSearchParams()
  
  if (params?.enrollmentsPage !== undefined) queryParams.set('enrollmentsPage', params.enrollmentsPage.toString())
  if (params?.enrollmentsSize !== undefined) queryParams.set('enrollmentsSize', params.enrollmentsSize.toString())
  if (params?.quizAttemptsPage !== undefined) queryParams.set('quizAttemptsPage', params.quizAttemptsPage.toString())
  if (params?.quizAttemptsSize !== undefined) queryParams.set('quizAttemptsSize', params.quizAttemptsSize.toString())
  if (params?.purchasesPage !== undefined) queryParams.set('purchasesPage', params.purchasesPage.toString())
  if (params?.purchasesSize !== undefined) queryParams.set('purchasesSize', params.purchasesSize.toString())
  if (params?.admissionsPage !== undefined) queryParams.set('admissionsPage', params.admissionsPage.toString())
  if (params?.admissionsSize !== undefined) queryParams.set('admissionsSize', params.admissionsSize.toString())

  const queryString = queryParams.toString()
  const url = `/api/user/profile${queryString ? `?${queryString}` : ''}`

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
    
    const error = await response.json().catch(() => ({ message: 'Failed to fetch user profile' }))
    throw new Error(error.message || 'Failed to fetch user profile')
  }

  return response.json()
}

/**
 * Update user profile (Client-side)
 * Uses Next.js API proxy route with cookie-based auth
 */
export async function updateUserProfile(data: UpdateUserRequest): Promise<UpdateUserResponse> {
  const response = await fetch('/api/user/me', {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    // If unauthorized, silently throw (user not logged in - expected)
    if (response.status === 401) {
      throw new Error('UNAUTHORIZED')
    }
    
    // For other errors, silently fail (don't log to console)
    const error = await response.json().catch(() => ({ message: 'Failed to update user profile' }))
    throw new Error(error.message || 'Failed to update user profile')
  }

  return response.json()
}
