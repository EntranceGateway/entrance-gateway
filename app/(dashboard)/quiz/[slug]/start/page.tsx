import type { Metadata } from 'next'
import { QuizStartPageContent } from '@/components/features/quiz/QuizStartPageContent'
import { getQuestionSet } from '@/services/server/questionSet.server'
import { logger } from '@/lib/logger'
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
  let questionSetId = 0

  try {
    questionSetId = parseInt(slug, 10)
    if (isNaN(questionSetId)) {
      logger.error('[QuizStartPage] Invalid quiz ID format:', slug)
      error = 'Unable to load quiz. Please try again.'
      return <QuizStartPageContent initialQuestions={questions} initialTitle={quizTitle} initialError={error} questionSetId={0} />
    }

    const response = await getQuestionSet(questionSetId)
    
    // Defensive checks for response structure
    if (!response?.data) {
      logger.error('[QuizStartPage] Invalid response structure')
      error = 'Unable to load quiz questions. Please try again later.'
      return <QuizStartPageContent initialQuestions={questions} initialTitle={quizTitle} initialError={error} questionSetId={questionSetId} />
    }

    const dataObj: Record<string, QuizQuestion[]> = response.data
    const flat: QuizQuestion[] = Object.values(dataObj).flat()

    if (flat.length === 0) {
      logger.error('[QuizStartPage] No questions found for quiz ID:', questionSetId)
      error = 'This quiz has no questions available yet.'
      return <QuizStartPageContent initialQuestions={questions} initialTitle={quizTitle} initialError={error} questionSetId={questionSetId} />
    }

    quizTitle = flat[0]?.questionSetTitle ?? 'Quiz'
    questions = flat
  } catch (err) {
    // Silent error logging - no sensitive details
    logger.error('[QuizStartPage] Error loading quiz:', err instanceof Error ? err.message : 'Unknown error')
    
    // User-friendly error message
    if (err instanceof Error) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        error = 'Please sign in to access this quiz.'
      } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
        error = 'You do not have access to this quiz. Please purchase it first.'
      } else if (err.message.includes('404') || err.message.includes('Not Found')) {
        error = 'Quiz not found. It may have been removed.'
      } else if (err.message.includes('Network') || err.message.includes('fetch')) {
        error = 'Network error. Please check your connection and try again.'
      } else {
        error = 'Unable to load quiz. Please try again later.'
      }
    } else {
      error = 'Unable to load quiz. Please try again later.'
    }
  }

  return <QuizStartPageContent initialQuestions={questions} initialTitle={quizTitle} initialError={error} questionSetId={questionSetId} />
}
