// Old Question Collection Types

export interface OldQuestion {
  id: number
  setName: string
  description: string
  year: number
  pdfFilePath: string
  syllabusId: number
  subject: string
  courseName: string
  affiliation: string
}

export interface OldQuestionsListResponse {
  message: string
  data: {
    content: OldQuestion[]
    totalElements: number
    totalPages: number
    pageNumber: number
    pageSize: number
    last: boolean
  }
}

export interface OldQuestionDetailResponse {
  message: string
  data: OldQuestion
}

export interface OldQuestionsFilters {
  page?: number
  size?: number
  sortBy?: 'year' | 'setName' | 'subject'
  sortDir?: 'asc' | 'desc'
  courseName?: string
  affiliation?: string
  year?: number
  subject?: string
}
