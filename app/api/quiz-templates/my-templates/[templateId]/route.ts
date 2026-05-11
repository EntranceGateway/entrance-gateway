import { NextResponse } from 'next/server'
import { getValidTokenOrRefresh } from '@/lib/auth/token'
import { logger } from '@/lib/logger'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * DELETE /api/quiz-templates/my-templates/[templateId]
 * Proxy for: DELETE /api/v1/quiz-templates/my-templates/{templateId}
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params
    const accessToken = await getValidTokenOrRefresh()

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Please sign in to manage your templates.' },
        { status: 401 }
      )
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/quiz-templates/my-templates/${encodeURIComponent(templateId)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 403 && response.status !== 404) {
        logger.error('[API] Backend error deleting user quiz template:', {
          status: response.status,
          templateId,
        })
      }

      return NextResponse.json(
        { message: data.message || 'Unable to archive this template.' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('[API] Error deleting user quiz template:', error)
    return NextResponse.json(
      { message: 'Unable to archive this template. Please try again later.' },
      { status: 500 }
    )
  }
}
