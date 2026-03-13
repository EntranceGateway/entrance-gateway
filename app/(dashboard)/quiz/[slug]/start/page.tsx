import type { Metadata } from 'next'
import { QuizStartPageContent } from '@/components/features/quiz/QuizStartPageContent'
import { getQuestionSet } from '@/services/server/questionSet.server'
import type { QuizQuestion } from '@/types/quiz-player.types'

export const metadata: Metadata = {
  title: 'Start Quiz | EntranceGateway',
  description: 'Take your quiz and test your knowledge.',
}

export default async function QuizStartPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let questions: QuizQuestion[] | null = null
  let quizTitle = 'Quiz'
  let error: string | null = null

  try {
    const questionSetId = parseInt(slug, 10)
    if (isNaN(questionSetId)) {
      throw new Error('Invalid quiz identifier')
    }

    const response = await getQuestionSet(questionSetId)
    const dataObj: Record<string, QuizQuestion[]> = response.data ?? {}
    const flat: QuizQuestion[] = Object.values(dataObj).flat()

    if (flat.length === 0) {
      throw new Error('No questions found for this quiz')
    }

    quizTitle = flat[0]?.questionSetTitle || 'Quiz'
    questions = flat
  } catch (err) {
    console.error('Failed to load quiz server-side:', err)
    error = err instanceof Error ? err.message : 'Failed to load quiz'
  }

  return <QuizStartPageContent initialQuestions={questions} initialTitle={quizTitle} initialError={error} />
}
