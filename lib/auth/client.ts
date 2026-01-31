'use client'

/**
 * Client-side auth utilities for cookie-based authentication
 */

/**
 * Get user ID from cookie (client-side)
 */
export function getUserId(): number | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  const userIdCookie = cookies.find(c => c.trim().startsWith('userId='))
  
  if (!userIdCookie) return null
  
  const userId = userIdCookie.split('=')[1]
  return userId ? parseInt(userId) : null
}

/**
 * Check if user is authenticated (client-side)
 * Note: This only checks for userId cookie, actual auth is verified server-side
 */
export function isAuthenticated(): boolean {
  return getUserId() !== null
}

/**
 * Login user (calls Next.js API route)
 */
export async function login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Login failed')
  }
  
  return data
}

/**
 * Register user (calls Next.js API route)
 */
export async function register(userData: {
  fullname: string
  email: string
  contact: string
  address: string
  dob: string
  interested: string
  latestQualification: string
  password: string
}) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed')
  }
  
  return data
}

/**
 * Verify OTP (calls Next.js API route)
 */
export async function verifyOtp(email: string, otp: string) {
  const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'OTP verification failed')
  }
  
  return data
}

/**
 * Resend OTP (calls Next.js API route)
 */
export async function resendOtp(email: string) {
  const response = await fetch('/api/auth/resend-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Resend OTP failed')
  }
  
  return data
}

/**
 * Refresh token (calls Next.js API route)
 */
export async function refreshToken() {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Token refresh failed')
  }
  
  return data
}

/**
 * Logout user (calls Next.js API route)
 */
export async function logout() {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Logout failed')
  }
  
  return data
}

/**
 * Store pending email in sessionStorage (for OTP flow)
 */
export function storePendingEmail(email: string): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem('pendingEmail', email)
}

/**
 * Get pending email from sessionStorage
 */
export function getPendingEmail(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem('pendingEmail')
}

/**
 * Clear pending email from sessionStorage
 */
export function clearPendingEmail(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem('pendingEmail')
}
