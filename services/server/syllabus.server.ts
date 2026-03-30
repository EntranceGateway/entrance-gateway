// Server-side Syllabus API calls (for SSR)

import type { SyllabusDetailResponse, SyllabusListResponse } from '@/types/syllabus.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.entrancegateway.com'

/**
 * Fetch single syllabus by ID or slug (Server-side for SSR)
 * Used in Server Components (page.tsx)
 */
export async function getSyllabusById(identifier: string): Promise<SyllabusDetailResponse> {
  // Check if identifier is a slug (contains hyphens and letters) or numeric ID
  const isSlug = /[a-z-]/.test(identifier)
  const endpoint = isSlug 
    ? `${API_BASE_URL}/api/v1/syllabus/slug/${identifier}`
    : `${API_BASE_URL}/api/v1/syllabus/${identifier}`
  
  const response = await fetch(endpoint, {
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

export async function getSyllabusList(): Promise<SyllabusListResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/syllabus?page=0&size=1000`, {
    method: 'GET',
    headers: {
      'Accept': '*/*',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch syllabus list: ${response.statusText}`)
  }

  return response.json()
}
