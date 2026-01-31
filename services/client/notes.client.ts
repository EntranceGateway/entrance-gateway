// Client-side Notes API calls (for CSR)
// Uses Next.js API routes as proxy to backend

import type {
  NotesListResponse,
  NoteDetailResponse,
  NotesQueryParams,
} from '@/types/notes.types'

/**
 * Fetch paginated list of notes (Client-side via proxy)
 * Used in Client Components with useState/useEffect or React Query
 */
export async function fetchNotes(
  params: NotesQueryParams = {}
): Promise<NotesListResponse> {
  const {
    page = 0,
    size = 10,
    sortBy = 'noteName',
    sortDir = 'asc',
    ...filters
  } = params

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir,
  })

  // Add filter params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString())
    }
  })

  const response = await fetch(`/api/notes?${queryParams}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch notes: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetch single note by ID (Client-side via proxy)
 * Used in Client Components
 */
export async function fetchNoteById(id: string): Promise<NoteDetailResponse> {
  const response = await fetch(`/api/notes/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch note: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetch notes by course, semester, and affiliation (Client-side via proxy)
 * Used in Client Components
 */
export async function fetchNotesByFilters(
  courseName: string,
  semester: number,
  affiliation: string
): Promise<NotesListResponse> {
  const queryParams = new URLSearchParams({
    courseName,
    semester: semester.toString(),
    affiliation,
  })

  const response = await fetch(`/api/notes/by-course-semester-affiliation?${queryParams}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch notes by filters: ${response.statusText}`)
  }

  return response.json()
}

