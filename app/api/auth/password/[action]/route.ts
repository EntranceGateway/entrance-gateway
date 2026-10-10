import { NextResponse } from 'next/server'

const API_BASE_URL = (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '')

export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params
  const endpoint = action === 'request' ? 'forgot-password' : action === 'reset' ? 'reset-password' : null
  if (!endpoint) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  let body: unknown
  try { body = await request.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/${endpoint}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body), cache: 'no-store', signal: AbortSignal.timeout(15000),
    })
    const data = await response.json()
    return NextResponse.json(response.ok ? data : { error: data.message || 'Password reset failed' }, { status: response.status })
  } catch {
    return NextResponse.json({ error: 'Password service is unavailable. Please try again.' }, { status: 503 })
  }
}
