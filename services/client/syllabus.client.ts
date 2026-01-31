// Client-side Syllabus API calls (for CSR)
// Uses Next.js API routes as proxy to backend

import type { SyllabusDetailResponse } from '@/types/syllabus.types'

/**
 * Fetch single syllabus by ID (Client-side via proxy)
 * Used in Client Components
 */
export async function fetchSyllabusById(id: string): Promise<SyllabusDetailResponse> {
  const response = await fetch(`/api/syllabus/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch syllabus: ${response.statusText}`)
  }

  return response.json()
}
