'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QuizPlayerContent } from '@/components/features/quiz/QuizPlayerContent'
import { useToast } from '@/components/shared/Toast'
import type { QuizQuestion } from '@/types/quiz-player.types'

interface QuizStartPageContentProps {
  initialQuestions: QuizQuestion[] | null
  initialTitle: string
  initialError: string | null
}

export function QuizStartPageContent({ initialQuestions, initialTitle, initialError }: QuizStartPageContentProps) {
  const router = useRouter()
  const { error: showError } = useToast()

  // Show toast on SSR error
  useEffect(() => {
    if (initialError) {
      showError(initialError)
    }
  }, [initialError, showError])

  // Error / empty state — show inline error + toast
  if (initialError || !initialQuestions || initialQuestions.length === 0) {
    return (
      <main className="flex-grow bg-gray-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Error banner (same pattern as TrainingsDetailContent) */}
          <div className="bg-semantic-error/10 border border-semantic-error text-semantic-error p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <div>
                <h3 className="font-bold text-lg mb-1">Unable to load quiz</h3>
                <p className="text-sm">
                  {initialError || 'No questions found for this quiz. Please try again later.'}
                </p>
              </div>
            </div>
          </div>

          {/* Go Back button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-navy text-white font-bold rounded-lg hover:bg-brand-blue transition-colors text-sm cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
              Go Back
            </button>
          </div>
        </div>
      </main>
    )
  }

  // Quiz player — full screen
  return (
    <QuizPlayerContent
      questions={initialQuestions}
      quizTitle={initialTitle}
      onExit={() => router.back()}
    />
  )
}
