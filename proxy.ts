import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isJwtExpired } from './lib/auth/expiry'

const API_BASE_URL = (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '')
const protectedPaths = ['/profile', '/my-enrollments', '/quiz/attempt/', '/leaderboard']
const authPaths = ['/signin', '/signup', '/verify-otp', '/forgot-password']

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  if (pathname === '/' && searchParams.has('code')) {
    const callback = new URL('/oauth2/callback', request.url)
    callback.search = request.nextUrl.search
    return NextResponse.rewrite(callback)
  }
  if (pathname.startsWith('/api/auth/') || pathname.startsWith('/oauth2/')) return NextResponse.next()

  const headers = new Headers(request.headers)
  headers.set('x-pathname', pathname)
  const protectedRoute = protectedPaths.some(path => pathname === path || pathname.startsWith(`${path}/`) || (path.endsWith('/') && pathname.startsWith(path))) || /^\/trainings\/[^/]+\/enroll$/.test(pathname)
  const authRoute = authPaths.includes(pathname)
  let token = request.cookies.get('accessToken')?.value
  let refreshToken = request.cookies.get('refreshToken')?.value
  let refreshed: { accessToken: string; refreshToken?: string; expiresIn: number } | null = null
  let clearSession = false

  if ((!token || isJwtExpired(token)) && refreshToken) {
    try {
      const upstream = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }), cache: 'no-store', signal: AbortSignal.timeout(8000),
      })
      if (upstream.ok) {
        const body = await upstream.json()
        if (typeof body.data?.accessToken === 'string' && Number.isFinite(body.data.expiresIn) && body.data.expiresIn > 0) {
          refreshed = body.data
          token = body.data.accessToken
          refreshToken = body.data.refreshToken || refreshToken
          const cookies = new Map(request.cookies.getAll().map(cookie => [cookie.name, cookie.value]))
          cookies.set('accessToken', token!)
          cookies.set('refreshToken', refreshToken!)
          headers.set('cookie', [...cookies].map(([name, value]) => `${name}=${encodeURIComponent(value)}`).join('; '))
        }
      } else if ([400, 401, 403].includes(upstream.status)) {
        clearSession = true
      }
    } catch {
      // Keep refresh credentials during a temporary backend outage.
    }
  }
  const authenticated = !!token && !isJwtExpired(token) && !clearSession
  let response: NextResponse
  if (protectedRoute && !authenticated) {
    const login = new URL('/signin', request.url)
    login.searchParams.set('redirect', pathname + request.nextUrl.search)
    response = NextResponse.redirect(login)
  } else if (authRoute && authenticated) {
    response = NextResponse.redirect(new URL('/', request.url))
  } else {
    response = NextResponse.next({ request: { headers } })
  }
  if (refreshed) {
    const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' }
    response.cookies.set('accessToken', refreshed.accessToken, { ...options, maxAge: refreshed.expiresIn })
    response.cookies.set('refreshToken', refreshToken!, { ...options, maxAge: 7 * 24 * 60 * 60 })
  }
  if (clearSession) for (const name of ['accessToken', 'refreshToken', 'userId']) response.cookies.delete(name)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
