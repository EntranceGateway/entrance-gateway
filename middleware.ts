import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

// Protected routes that require authentication
const protectedPaths = [
//   '/dashboard',
  '/profile',
//   '/notes',
//   '/syllabus',
//   '/questions',
//   '/colleges',
]

// Auth routes that should redirect to home if already logged in
const authPaths = ['/signin', '/signup']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  
  // Check if current path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  const isAuthPath = authPaths.some(path => pathname.startsWith(path))
  
  // Redirect authenticated users away from auth pages
  if (isAuthPath && accessToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Allow access to non-protected routes
  if (!isProtectedPath) {
    return NextResponse.next()
  }
  
  // Protected route - check authentication
  if (!accessToken && !refreshToken) {
    // No tokens - redirect to login
    const loginUrl = new URL('/signin', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Access token missing but refresh token exists - try to refresh
  if (!accessToken && refreshToken) {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })
      
      if (refreshResponse.ok) {
        const data = await refreshResponse.json()
        const response = NextResponse.next()
        
        // Update cookies with new tokens
        response.cookies.set('accessToken', data.data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: data.data.expiresIn,
          path: '/',
        })
        
        response.cookies.set('refreshToken', data.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        })
        
        return response
      } else {
        // Refresh failed - clear cookies and redirect to login
        const loginUrl = new URL('/signin', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        const response = NextResponse.redirect(loginUrl)
        
        response.cookies.delete('accessToken')
        response.cookies.delete('refreshToken')
        response.cookies.delete('userId')
        
        return response
      }
    } catch (error) {
      console.error('Token refresh error in middleware:', error)
      
      // Error during refresh - redirect to login
      const loginUrl = new URL('/signin', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      
      response.cookies.delete('accessToken')
      response.cookies.delete('refreshToken')
      response.cookies.delete('userId')
      
      return response
    }
  }
  
  // Access token exists - allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
