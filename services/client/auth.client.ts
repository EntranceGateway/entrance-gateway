// Client-side Auth Service
// Cookie-based authentication - single source of truth
import { apiClient } from '../api/client'
import type {
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/types/auth.types'

/**
 * Register a new user
 */
export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
  return apiClient<RegisterResponse>('/api/v1/auth/user/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Verify OTP code
 */
export async function verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  return apiClient<VerifyOtpResponse>('/api/v1/auth/user/verify-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Resend OTP code
 */
export async function resendOtp(data: ResendOtpRequest): Promise<ResendOtpResponse> {
  return apiClient<ResendOtpResponse>('/api/v1/auth/user/resend-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Login user
 * Tokens are stored in httpOnly cookies by the server
 */
export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Refresh access token using refresh token
 * Cookies are automatically updated by the server
 */
export async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  // This calls the Next.js API route which handles cookie-based refresh
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Token refresh failed' }))
    throw new Error(error.error || 'Token refresh failed')
  }

  return response.json()
}

/**
 * Check if user is authenticated
 * Uses cookie-based check via API proxy
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/token', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include',
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get redirect URL after login
 */
export function getRedirectAfterLogin(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem('redirectAfterLogin')
}

/**
 * Clear redirect URL
 */
export function clearRedirectAfterLogin(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem('redirectAfterLogin')
}

/**
 * Store pending email for OTP verification (sessionStorage only)
 */
export function storePendingEmail(email: string): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem('pendingEmail', email)
  } catch (error) {
    console.error('Failed to store pending email:', error)
  }
}

/**
 * Get pending email for OTP verification
 */
export function getPendingEmail(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return sessionStorage.getItem('pendingEmail')
  } catch (error) {
    console.error('Failed to get pending email:', error)
    return null
  }
}

/**
 * Clear pending email
 */
export function clearPendingEmail(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem('pendingEmail')
  } catch (error) {
    console.error('Failed to clear pending email:', error)
  }
}
