// Quiz/Question Set Types

export interface Quiz {
  questionSetId: number
  slug: string
  setName: string
  nosOfQuestions: number
  durationInMinutes: number
  description: string
  price: number
  courseId: number
  courseName: string
}

export interface QuizListResponse {
  message: string
  data: {
    content: Quiz[]
    totalElements: number
    totalPages: number
    pageNumber: number
    pageSize: number
    last: boolean
  }
}

export interface QuizDetailResponse {
  message: string
  data: Quiz
}

export interface QuizParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}
