// Client-side User API calls (for CSR)
// Uses Next.js API proxy routes for cookie-based authentication

import type { UserResponse, UpdateUserRequest, UpdateUserResponse } from '@/types/user.types'

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
