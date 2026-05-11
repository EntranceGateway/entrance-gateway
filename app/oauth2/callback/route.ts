import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'
const DEFAULT_ACCESS_TOKEN_MAX_AGE = 60 * 15
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7
const OAUTH_TIMEOUT_MS = 8000

interface OAuthTokenResponse {
  message?: string
  data?: {
    accessToken?: string
    refreshToken?: string
    userId?: string | number
    expiresIn?: number
  }
}

function sanitizeRedirect(value: string | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/'
  }

  return value
}

function sanitizeErrorCode(value: string | null | undefined): string {
  if (!value) return 'oauth_failed'
  return /^[a-zA-Z0-9_-]{1,64}$/.test(value) ? value : 'oauth_failed'
}

function buildSignInRedirect(origin: string, error: string) {
  const signInUrl = new URL('/signin', origin)
  signInUrl.searchParams.set('error', sanitizeErrorCode(error))
  return signInUrl
}

function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  userId: string,
  expiresIn: number
) {
  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: Number.isFinite(expiresIn) && expiresIn > 0 ? expiresIn : DEFAULT_ACCESS_TOKEN_MAX_AGE,
    path: '/',
  })

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: '/',
  })

  response.cookies.set('userId', userId, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: '/',
  })
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const error = searchParams.get('error')
  const code = searchParams.get('code')
  const redirectAfterLogin = sanitizeRedirect(request.cookies.get('oauthRedirectAfterLogin')?.value)

  if (error) {
    const response = NextResponse.redirect(buildSignInRedirect(origin, error))
    response.cookies.delete('oauthRedirectAfterLogin')
    return response
  }

  if (!code) {
    const response = NextResponse.redirect(buildSignInRedirect(origin, 'missing_code'))
    response.cookies.delete('oauthRedirectAfterLogin')
    return response
  }

  try {
    const tokenResponse = await fetch(`${API_BASE_URL}/api/v1/auth/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ code }),
      cache: 'no-store',
      signal: AbortSignal.timeout(OAUTH_TIMEOUT_MS),
    })

    const tokenData: OAuthTokenResponse = await tokenResponse.json().catch(() => ({}))

    if (!tokenResponse.ok) {
      const response = NextResponse.redirect(
        buildSignInRedirect(
          origin,
          tokenResponse.status === 400 ? 'oauth_session_expired' : 'oauth_exchange_failed'
        )
      )
      response.cookies.delete('oauthRedirectAfterLogin')
      return response
    }

    const accessToken = tokenData.data?.accessToken
    const refreshToken = tokenData.data?.refreshToken
    const userId = tokenData.data?.userId
    const expiresIn = Number(tokenData.data?.expiresIn || DEFAULT_ACCESS_TOKEN_MAX_AGE)

    if (!accessToken || !refreshToken || !userId) {
      const response = NextResponse.redirect(buildSignInRedirect(origin, 'oauth_incomplete_response'))
      response.cookies.delete('oauthRedirectAfterLogin')
      return response
    }

    const response = NextResponse.redirect(new URL(redirectAfterLogin, origin))
    setAuthCookies(response, accessToken, refreshToken, userId.toString(), expiresIn)
    response.cookies.delete('oauthRedirectAfterLogin')

    return response
  } catch {
    const response = NextResponse.redirect(buildSignInRedirect(origin, 'token_exchange_failed'))
    response.cookies.delete('oauthRedirectAfterLogin')
    return response
  }
}
