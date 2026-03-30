'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useToast } from '@/components/shared/Toast'
import type { QuizQuestion } from '@/types/quiz-player.types'

// Dynamically import QuizPlayerContent with SSR disabled to avoid ToastProvider context issues
const QuizPlayerContent = dynamic(
  () => import('@/components/features/quiz/QuizPlayerContent').then(mod => ({ default: mod.QuizPlayerContent })),
  { 
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-[60] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block size-12 animate-spin rounded-full border-4 border-solid border-brand-blue border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }
)

interface QuizStartPageContentProps {
  initialQuestions: QuizQuestion[] | null
  initialTitle: string
  initialError: string | null
  questionSetId: number
}

export function QuizStartPageContent({ initialQuestions, initialTitle, initialError, questionSetId }: QuizStartPageContentProps) {
  const router = useRouter()
  const { error: showError } = useToast()
  const [hasShownToast, setHasShownToast] = useState(false)

  // Show toast only after component mounts on client (not during SSR)
  useEffect(() => {
    if (initialError && !hasShownToast) {
      showError(initialError)
      setHasShownToast(true)
    }
  }, [initialError, showError, hasShownToast])

  // Error / empty state — show inline error + toast
  if (initialError || !initialQuestions || initialQuestions.length === 0) {
    const errorMessage = initialError ?? 'No questions found for this quiz. Please try again later.'
    
    return (
      <main className="flex-grow bg-gray-50">
        <article data-role="page-content" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <span
            className="sr-only"
            data-role="meta-quiz-info"
            data-quiz-title={initialTitle}
            data-question-count={initialQuestions?.length ?? 0}
            data-detail-uri={`/quiz/${questionSetId}/start`}
          />
          {/* Error banner */}
          <div className="bg-semantic-error/10 border border-semantic-error text-semantic-error p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <div>
                <h3 data-role="page-title" className="font-bold text-lg mb-1">Unable to load quiz</h3>
                <p data-role="description" className="text-sm">{errorMessage}</p>
              </div>
            </div>
          </div>

          {/* Go Back button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-navy text-white font-bold rounded-lg hover:bg-brand-blue transition-colors text-sm cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
              Go Back
            </button>
          </div>
        </article>
      </main>
    )
  }

  // Quiz player — full screen
  return (
    <QuizPlayerContent
      questions={initialQuestions}
      quizTitle={initialTitle}
      questionSetId={questionSetId}
      onExit={() => router.back()}
    />
  )
}
