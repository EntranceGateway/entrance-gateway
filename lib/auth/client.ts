'use client'

/**
 * Client-side auth utilities for cookie-based authentication
 * Single source of truth: cookies (no localStorage for tokens)
 */

/**
 * Parse cookies from document.cookie
 */
function parseCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {}

  const cookies: Record<string, string> = {}
  document.cookie.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=')
    const trimmedName = name.trim()
    const value = rest.join('=').trim()
    if (trimmedName && value) {
      cookies[trimmedName] = value
    }
  })

  return cookies
}

/**
 * Get user ID from cookie (client-side)
 */
export function getUserId(): number | null {
  const cookies = parseCookies()
  const userId = cookies['userId']
  if (!userId) return null
  const parsed = parseInt(userId)
  return Number.isNaN(parsed) ? null : parsed
}

/**
 * Check if user is authenticated (client-side)
 * Checks for userId cookie presence - actual token validation happens server-side
 */
export function isAuthenticated(): boolean {
  return getUserId() !== null
}

/**
 * Login user (calls Next.js API route)
 * Tokens are stored in httpOnly cookies by the server
 */
export async function login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  })

  const data = await response.json()

  if (!response.ok) {
    // Handle specific status codes
    switch (response.status) {
      case 400:
        throw new Error(data.error || 'Invalid email or password format')
      case 401:
        throw new Error(data.error || 'Invalid email or password')
      case 403:
        throw new Error(data.error || 'Account is disabled. Please contact support')
      case 404:
        throw new Error(data.error || 'Account not found')
      case 429:
        throw new Error(data.error || 'Too many login attempts. Please try again later')
      case 500:
      case 502:
      case 503:
        throw new Error(data.error || 'Server error. Please try again later')
      default:
        throw new Error(data.error || 'Login failed. Please try again')
    }
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
    credentials: 'include',
  })

  const data = await response.json()

  if (!response.ok) {
    // Handle specific status codes
    switch (response.status) {
      case 400:
        throw new Error(data.error || 'Invalid registration data. Please check all fields')
      case 409:
        throw new Error(data.error || 'Email already registered. Please sign in instead')
      case 422:
        throw new Error(data.error || 'Validation failed. Please check your input')
      case 429:
        throw new Error(data.error || 'Too many registration attempts. Please try again later')
      case 500:
      case 502:
      case 503:
        throw new Error(data.error || 'Server error. Please try again later')
      default:
        throw new Error(data.error || 'Registration failed. Please try again')
    }
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
    credentials: 'include',
  })

  const data = await response.json()

  if (!response.ok) {
    // Handle specific status codes
    switch (response.status) {
      case 400:
        throw new Error(data.error || 'Invalid OTP format')
      case 401:
        throw new Error(data.error || 'Invalid or incorrect OTP')
      case 404:
        throw new Error(data.error || 'Email not found or OTP expired')
      case 410:
        throw new Error(data.error || 'OTP has expired. Please request a new code')
      case 429:
        throw new Error(data.error || 'Too many verification attempts. Please try again later')
      case 500:
      case 502:
      case 503:
        throw new Error(data.error || 'Server error. Please try again later')
      default:
        throw new Error(data.error || 'OTP verification failed. Please try again')
    }
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
    credentials: 'include',
  })

  const data = await response.json()

  if (!response.ok) {
    // Handle specific status codes
    switch (response.status) {
      case 400:
        throw new Error(data.error || 'Invalid email address')
      case 404:
        throw new Error(data.error || 'Email not found')
      case 429:
        throw new Error(data.error || 'Too many requests. Please wait before requesting another code')
      case 500:
      case 502:
      case 503:
        throw new Error(data.error || 'Server error. Please try again later')
      default:
        throw new Error(data.error || 'Failed to resend OTP. Please try again')
    }
  }

  return data
}

/**
 * Refresh token (calls Next.js API route)
 * Server updates httpOnly cookies automatically
 */
export async function refreshToken() {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Token refresh failed')
  }

  return data
}

/**
 * Logout user (calls Next.js API route to clear server cookies)
 */
export async function logout() {
  try {
    // Call server API to clear httpOnly cookies
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Logout failed')
    }

    // Clear client-side accessible cookies
    clearClientCookies()

    return data
  } catch (error) {
    // Even if API fails, clear client cookies
    clearClientCookies()
    throw error
  }
}

/**
 * Clear client-side accessible cookies (not httpOnly)
 */
function clearClientCookies(): void {
  if (typeof window === 'undefined') return

  try {
    const cookies = document.cookie.split(';')
    cookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim()
      // Delete cookie by setting expiry to past date
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    })
  } catch (e) {
    // Silently fail
  }
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
