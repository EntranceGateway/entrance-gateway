// Notes API Types - Matching backend response structure

export interface Note {
  noteId: number
  slug: string
  subject: string // The actual note title/name (displayed to users)
  subjectCode: string
  noteName: string // The PDF file name (used for Resource API)
  syllabusId: number
  noteDescription: string
  courseId: number
  courseName: string
  semester: number
  year: number | null
  affiliation: string
  noteFile?: string // Deprecated - use noteName instead
}

export interface NotesListResponse {
  message: string
  data: {
    content: Note[]
    totalElements: number
    totalPages: number
    pageNumber: number
    pageSize: number
    last: boolean
  }
}

export interface NoteDetailResponse {
  message: string
  data: Note
}

export interface NotesQueryParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  courseName?: string
  semester?: number
  affiliation?: string
}

// Error response type
export interface ApiErrorResponse {
  message: string
  data: null
}
