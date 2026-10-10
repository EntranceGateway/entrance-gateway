import { NextRequest, NextResponse } from 'next/server'
import { fetchWithAuthRetry } from '@/lib/auth/apiProxy'
import { logger } from '@/lib/logger'

const API_BASE_URL = (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '')

export async function GET(request: NextRequest, { params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params
  if (!/^[1-9]\d*$/.test(categoryId)) return NextResponse.json({ message: 'Invalid category ID' }, { status: 400 })
  const query = new URLSearchParams()
  for (const key of ['entranceTypeId', 'questionSetId', 'templateId']) {
    const value = request.nextUrl.searchParams.get(key)
    if (value !== null) query.set(key, value)
  }
  try {
    const { response } = await fetchWithAuthRetry(
      `${API_BASE_URL}/api/v1/quiz-attempts/rank/category/${categoryId}?${query}`, { cache: 'no-store' })
    if (!response) return NextResponse.json({ message: 'Please sign in to view your category rank.' }, { status: 401 })
    return NextResponse.json(await response.json(), { status: response.status })
  } catch (error) {
    logger.error('[API] Category ranking request failed:', error)
    return NextResponse.json({ message: 'Unable to load category ranking.' }, { status: 502 })
  }
}
