// Server-side Notes API calls (for SSR)

import { apiClient } from '../api/client'
import type {
  NotesListResponse,
  NoteDetailResponse,
  NotesQueryParams,
} from '@/types/notes.types'

/**
 * Fetch paginated list of notes (Server-side)
 * Used in Server Components for SSR
 */
export async function getNotes(
  params: NotesQueryParams = {}
): Promise<NotesListResponse> {
  const {
    page = 0,
    size = 10,
    sortBy = 'noteName',
    sortDir = 'asc',
    ...filters
  } = params

  return apiClient<NotesListResponse>('/api/v1/notes', {
    params: {
      page,
      size,
      sortBy,
      sortDir,
      ...filters,
    },
    // Use 'no-store' for dynamic data that changes frequently
    cache: 'no-store',
    // Alternative: Use revalidation for ISR
    // next: { revalidate: 60 }, // Revalidate every 60 seconds
  })
}

/**
 * Fetch single note by ID (Server-side)
 * Used in Server Components for SSR
 */
export async function getNoteById(id: string): Promise<NoteDetailResponse> {
  return apiClient<NoteDetailResponse>(`/api/v1/notes/${id}`, {
    cache: 'no-store',
    // Alternative: Use tags for on-demand revalidation
    // next: { tags: ['note', `note-${id}`] },
  })
}

/**
 * Fetch notes by course, semester, and affiliation (Server-side)
 * Used in Server Components for SSR
 */
export async function getNotesByFilters(
  courseName: string,
  semester: number,
  affiliation: string
): Promise<NotesListResponse> {
  return apiClient<NotesListResponse>(
    '/api/v1/notes/by-course-semester-affiliation',
    {
      params: {
        courseName,
        semester,
        affiliation,
      },
      cache: 'no-store',
    }
  )
}

/**
 * Fetch all notes for category aggregation (Server-side)
 * Used for homepage category display
 */
export async function getAllNotes(): Promise<NotesListResponse> {
  return apiClient<NotesListResponse>('/api/v1/notes', {
    params: {
      page: 0,
      size: 1000, // Fetch large set to get all categories
    },
    cache: 'no-store',
  })
}
