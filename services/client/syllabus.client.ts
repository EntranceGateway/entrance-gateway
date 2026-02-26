// Client-side Syllabus API calls (for CSR)
// Uses Next.js API routes as proxy to backend

import type { SyllabusDetailResponse } from '@/types/syllabus.types'

/**
 * Fetch single syllabus by ID or slug (Client-side via proxy)
 * Used in Client Components
 */
export async function fetchSyllabusById(identifier: string): Promise<SyllabusDetailResponse> {
  // Check if identifier is a slug (contains hyphens and letters) or numeric ID
  const isSlug = /[a-z-]/.test(identifier)
  const endpoint = isSlug 
    ? `/api/syllabus/slug/${identifier}`
    : `/api/syllabus/${identifier}`
  
  console.log('Fetching syllabus from:', endpoint)
  
  const response = await fetch(endpoint, {
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
