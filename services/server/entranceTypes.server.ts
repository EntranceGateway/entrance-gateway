import { getValidTokenOrRefresh } from '@/lib/auth/token'
import { logger } from '@/lib/logger'
import type { EntranceType } from '@/types/quizTemplate.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

function normalizeEntranceTypes(candidate: unknown): EntranceType[] {
  if (!Array.isArray(candidate)) return []

  return candidate
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const record = item as Record<string, unknown>
      const entranceTypeId = Number(record.entranceTypeId ?? record.id)
      const entranceName = String(record.entranceName ?? record.name ?? '')
      const slug = String(record.slug ?? '')

      if (!Number.isFinite(entranceTypeId) || !entranceName || !slug) return null

      const entrance: EntranceType = {
        entranceTypeId,
        entranceName,
        slug,
      }

      if (typeof record.description === 'string') {
        entrance.description = record.description
      }

      return entrance
    })
    .filter((item): item is EntranceType => item !== null)
}

export async function getEntranceTypes(): Promise<EntranceType[]> {
  try {
    const accessToken = await getValidTokenOrRefresh()
    const headers: HeadersInit = {
      Accept: 'application/json',
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    const endpointCandidates = [
      `${API_BASE_URL}/api/v1/entrance-types`,
    ]

    let response: Response | null = null
    let responseData: unknown = null

    for (const endpoint of endpointCandidates) {
      response = await fetch(endpoint, {
        method: 'GET',
        headers,
        next: { revalidate: 300 },
      })

      responseData = await response.json().catch(() => null)

      if (response.ok) break

      if (response.status !== 404) {
        break
      }
    }

    if (!response) {
      return []
    }

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 404) {
        logger.error('[getEntranceTypes] Failed to fetch entrance types:', { status: response.status })
      }
      return []
    }

    const responseRecord = responseData && typeof responseData === 'object'
      ? responseData as Record<string, unknown>
      : {}
    const responseDataRecord = responseRecord.data && typeof responseRecord.data === 'object'
      ? responseRecord.data as Record<string, unknown>
      : {}

    const candidates = [
      responseData,
      responseRecord.data,
      responseDataRecord.content,
      responseRecord.content,
    ]

    for (const candidate of candidates) {
      const normalized = normalizeEntranceTypes(candidate)
      if (normalized.length > 0) return normalized
    }

    return []
  } catch (error) {
    logger.error('[getEntranceTypes] Unexpected error:', error instanceof Error ? error.message : 'Unknown error')
    return []
  }
}
