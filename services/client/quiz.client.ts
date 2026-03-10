import { apiClient } from '../api/client'
import type { QuizListResponse, QuizParams } from '@/types/quiz.types'

/**
 * Fetch paginated list of quizzes (Client-side)
 * Used in Client Components with useState/useEffect
 * Endpoint: GET /api/v1/question-sets
 */
export async function fetchQuizzes(
  params: QuizParams = {}
): Promise<QuizListResponse> {
  const {
    page = 0,
    size = 10,
    sortBy = 'setName',
    sortDir = 'asc',
  } = params

  return apiClient<QuizListResponse>('/api/v1/question-sets', {
    params: {
      page,
      size,
      sortBy,
      sortDir,
    },
  })
}

/**
 * Fetch single quiz by ID (Client-side)
 * Endpoint: GET /api/v1/question-sets/{id}
 */
export async function fetchQuizById(id: number): Promise<any> {
  return apiClient<any>(`/api/v1/question-sets/${id}`)
}

/**
 * Fetch single quiz by slug (Client-side)
 * Endpoint: GET /api/v1/question-sets/slug/{slug}
 */
export async function fetchQuizBySlug(slug: string): Promise<any> {
  return apiClient<any>(`/api/v1/question-sets/slug/${slug}`)
}
