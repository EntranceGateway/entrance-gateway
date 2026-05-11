import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'
const OAUTH_COOKIE_MAX_AGE = 60 * 5

function sanitizeRedirect(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/'
  return value
}

export async function GET(request: NextRequest) {
  const redirect = sanitizeRedirect(request.nextUrl.searchParams.get('redirect'))
  const target = `${API_BASE_URL}/oauth2/authorization/google`

  const response = NextResponse.redirect(target)
  response.cookies.set('oauthRedirectAfterLogin', redirect, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: OAUTH_COOKIE_MAX_AGE,
    path: '/',
  })

  return response
}
