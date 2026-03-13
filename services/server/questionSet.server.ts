import { cookies } from 'next/headers'
import { apiClient } from '../api/client'
import type { QuestionSetResponse } from '@/types/quiz-player.types'

/**
 * Fetch question set with all questions (Server-side)
 * Uses apiClient with authentication cookie forwarding
 * Endpoint: GET /api/v1/questions/set/{questionSetId}
 */
export async function getQuestionSet(questionSetId: number): Promise<QuestionSetResponse> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  return apiClient<QuestionSetResponse>(`/api/v1/questions/set/${questionSetId}`, {
    headers: accessToken ? {
      'Authorization': `Bearer ${accessToken}`,
    } : undefined,
    cache: 'no-store',
  })
}
