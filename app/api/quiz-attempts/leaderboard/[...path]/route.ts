import { NextRequest, NextResponse } from 'next/server'
import { fetchWithAuthRetry } from '@/lib/auth/apiProxy'
import { logger } from '@/lib/logger'

const API_BASE_URL = (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '')

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join('/')
  if (!/^(options|category\/[1-9]\d*)$/.test(path)) {
    return NextResponse.json({ message: 'Invalid leaderboard path.' }, { status: 400 })
  }
  const query = new URLSearchParams()
  for (const key of ['entranceTypeId', 'page', 'size']) {
    const value = request.nextUrl.searchParams.get(key)
    if (value !== null) query.set(key, value)
  }
  try {
    const { response } = await fetchWithAuthRetry(
      `${API_BASE_URL}/api/v1/quiz-attempts/leaderboard/${path}?${query}`, { cache: 'no-store' })
    if (!response) return NextResponse.json({ message: 'Please sign in to view the leaderboard.' }, { status: 401 })
    return NextResponse.json(await response.json(), { status: response.status })
  } catch (error) {
    logger.error('[API] Leaderboard request failed:', error)
    return NextResponse.json({ message: 'Unable to load the leaderboard.' }, { status: 502 })
  }
}
