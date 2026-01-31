// Server-side Syllabus API calls (for SSR)

import type { SyllabusDetailResponse } from '@/types/syllabus.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.entrancegateway.com'

/**
 * Fetch single syllabus by ID (Server-side for SSR)
 * Used in Server Components (page.tsx)
 */
export async function getSyllabusById(id: string): Promise<SyllabusDetailResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/syllabus/${id}`, {
    method: 'GET',
    headers: {
      'Accept': '*/*',
    },
    cache: 'no-store', // Dynamic rendering (SSR)
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch syllabus: ${response.statusText}`)
  }

  return response.json()
}
