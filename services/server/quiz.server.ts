import { apiClient } from '../api/client'
import type { QuizListResponse, QuizParams, QuizDetailResponse } from '@/types/quiz.types'

/**
 * Fetch paginated list of quizzes (Server-side)
 * Used in Server Components for SSR
 * Endpoint: GET /api/v1/question-sets
 */
export async function getQuizzes(
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
    cache: 'no-store',
  })
}

/**
 * Fetch single quiz by ID (Server-side)
 * Used in Server Components for SSR
 * Endpoint: GET /api/v1/question-sets/{id}
 */
export async function getQuizById(id: number): Promise<QuizDetailResponse> {
  return apiClient<QuizDetailResponse>(`/api/v1/question-sets/${id}`, {
    cache: 'no-store',
  })
}

/**
 * Fetch single quiz by slug (Server-side)
 * Used in Server Components for SSR
 * Endpoint: GET /api/v1/question-sets/slug/{slug}
 */
export async function getQuizBySlug(slug: string): Promise<QuizDetailResponse> {
  return apiClient<QuizDetailResponse>(`/api/v1/question-sets/slug/${slug}`, {
    cache: 'no-store',
  })
}
