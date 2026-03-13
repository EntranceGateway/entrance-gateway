/**
 * Fetch question set with all questions
 * Uses Next.js API proxy route: GET /api/question-sets/[id]
 * Backend endpoint: GET /api/v1/questions/set/{questionSetId}
 */
export async function fetchQuestionSet(questionSetId: number) {
  try {
    const response = await fetch(`/api/question-sets/${questionSetId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to fetch question set')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching question set:', error)
    throw error
  }
}
