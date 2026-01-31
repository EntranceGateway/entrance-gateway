// Client-side Auth Service
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

// Refresh token state management
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

/**
 * Subscribe to token refresh completion
 */
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

/**
 * Notify all subscribers when refresh completes
 */
function onRefreshComplete(token: string) {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

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
 */
export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
  return apiClient<RefreshTokenResponse>('/api/v1/auth/refresh-token', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  })
}

/**
 * Store auth tokens in localStorage with encryption consideration
 */
export function storeAuthTokens(tokens: LoginResponse['data'] | RefreshTokenResponse['data']): void {
  if (typeof window === 'undefined') return
  
  try {
    // Store tokens
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
    localStorage.setItem('tokenType', tokens.tokenType)
    localStorage.setItem('expiresIn', tokens.expiresIn.toString())
    
    // Only update userId if provided (login response includes it, refresh doesn't)
    if ('userId' in tokens) {
      localStorage.setItem('userId', tokens.userId.toString())
    }
    
    // Calculate and store token expiry timestamp
    const expiryTime = Date.now() + tokens.expiresIn * 1000
    localStorage.setItem('tokenExpiryTime', expiryTime.toString())
    
    // Store last refresh time for tracking
    localStorage.setItem('lastRefreshTime', Date.now().toString())
  } catch (error) {
    console.error('Failed to store auth tokens:', error)
  }
}

/**
 * Get auth tokens from localStorage
 */
export function getAuthTokens(): LoginResponse['data'] | null {
  if (typeof window === 'undefined') return null
  
  try {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const tokenType = localStorage.getItem('tokenType')
    const expiresIn = localStorage.getItem('expiresIn')
    const userId = localStorage.getItem('userId')
    
    if (!accessToken || !refreshToken || !userId) return null
    
    return {
      accessToken,
      refreshToken,
      tokenType: tokenType || 'Bearer',
      expiresIn: expiresIn ? parseInt(expiresIn) : 900,
      userId: parseInt(userId),
    }
  } catch (error) {
    console.error('Failed to get auth tokens:', error)
    return null
  }
}

/**
 * Check if access token is expired or about to expire
 * Best Practice: Refresh 2 minutes before expiry to prevent edge cases
 */
export function isTokenExpired(): boolean {
  if (typeof window === 'undefined') return true
  
  try {
    const expiryTime = localStorage.getItem('tokenExpiryTime')
    if (!expiryTime) return true
    
    const expiryTimestamp = parseInt(expiryTime)
    const currentTime = Date.now()
    
    // Refresh 2 minutes (120 seconds) before expiry
    const bufferTime = 120000 // 2 minutes in milliseconds
    return currentTime >= expiryTimestamp - bufferTime
  } catch (error) {
    console.error('Failed to check token expiry:', error)
    return true
  }
}

/**
 * Check if refresh token should be rotated
 * Best Practice: Rotate refresh token after 7 days or on each use
 */
export function shouldRotateRefreshToken(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const lastRefreshTime = localStorage.getItem('lastRefreshTime')
    if (!lastRefreshTime) return true
    
    const lastRefresh = parseInt(lastRefreshTime)
    const currentTime = Date.now()
    
    // Rotate if last refresh was more than 7 days ago
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    return currentTime - lastRefresh > sevenDays
  } catch (error) {
    return false
  }
}

/**
 * Refresh token if expired and update localStorage
 * Best Practice: Handle concurrent requests with queue
 */
export async function refreshTokenIfNeeded(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  
  const tokens = getAuthTokens()
  if (!tokens) return false
  
  // Check if token is expired or about to expire
  if (!isTokenExpired()) return true
  
  // If already refreshing, wait for completion
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(!!token)
      })
    })
  }
  
  isRefreshing = true
  
  try {
    const response = await refreshAccessToken(tokens.refreshToken)
    
    // Update tokens in localStorage
    storeAuthTokens(response.data)
    
    // Notify all waiting requests
    onRefreshComplete(response.data.accessToken)
    
    isRefreshing = false
    return true
  } catch (error) {
    isRefreshing = false
    
    // Refresh failed, clear tokens and redirect to login
    clearAuthTokens()
    
    if (typeof window !== 'undefined') {
      // Store redirect URL for post-login navigation
      const currentPath = window.location.pathname
      if (currentPath !== '/signin' && currentPath !== '/signup') {
        sessionStorage.setItem('redirectAfterLogin', currentPath)
      }
      
      window.location.href = '/signin'
    }
    
    return false
  }
}

/**
 * Get access token with automatic refresh
 * Best Practice: Always use this for API calls
 */
export async function getValidAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null
  
  // Try to refresh token if needed
  const isValid = await refreshTokenIfNeeded()
  if (!isValid) return null
  
  const tokens = getAuthTokens()
  return tokens?.accessToken || null
}

/**
 * Clear auth tokens from localStorage
 * Best Practice: Clear all auth-related data
 */
export function clearAuthTokens(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('tokenType')
    localStorage.removeItem('expiresIn')
    localStorage.removeItem('userId')
    localStorage.removeItem('tokenExpiryTime')
    localStorage.removeItem('lastRefreshTime')
    
    // Clear any cached user data
    sessionStorage.removeItem('redirectAfterLogin')
  } catch (error) {
    console.error('Failed to clear auth tokens:', error)
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthTokens() !== null
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
 * Store pending email for OTP verification
 */
export function storePendingEmail(email: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('pendingEmail', email)
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
    return localStorage.getItem('pendingEmail')
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
    localStorage.removeItem('pendingEmail')
  } catch (error) {
    console.error('Failed to clear pending email:', error)
  }
}
