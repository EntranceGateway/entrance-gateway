import type { QuizListResponse, QuizParams, QuizDetailResponse } from '@/types/quiz.types'

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

  const query = new URLSearchParams({ page: String(page), size: String(size), sortBy, sortDir })
  const response = await fetch(`/api/quiz?${query}`)
  if (!response.ok) throw new Error('Failed to fetch quizzes')
  return response.json()
}

/**
 * Fetch single quiz by ID (Client-side)
 * Endpoint: GET /api/v1/question-sets/{id}
 */
export async function fetchQuizById(id: number): Promise<QuizDetailResponse> {
  const response = await fetch(`/api/quiz/${id}`)
  if (!response.ok) throw new Error('Failed to fetch quiz')
  return response.json()
}

/**
 * Fetch single quiz by slug (Client-side)
 * Endpoint: GET /api/v1/question-sets/slug/{slug}
 */
export async function fetchQuizBySlug(slug: string): Promise<QuizDetailResponse> {
  const response = await fetch(`/api/quiz/slug/${encodeURIComponent(slug)}`)
  if (!response.ok) throw new Error('Failed to fetch quiz')
  return response.json()
}
