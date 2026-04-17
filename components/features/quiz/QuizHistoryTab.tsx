import { useState, useEffect } from 'react'
import { fetchQuizAttemptHistory } from '@/services/client/quizAttempt.client'
import type { QuizHistoryItem } from '@/services/client/quizAttempt.client'
import { QuizHistoryCard } from './QuizHistoryCard'
import { QuizCategoryAnalysisBlock } from './QuizCategoryAnalysisBlock'
import { CardGridSkeleton } from '@/components/shared/Loading'

export function QuizHistoryTab() {
  const [historyItems, setHistoryItems] = useState<QuizHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetchQuizAttemptHistory()
        setHistoryItems(response?.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load history.')
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [])

  if (isLoading) {
    return <CardGridSkeleton />
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center border border-red-100 flex flex-col items-center justify-center min-h-[300px]">
        <span className="material-symbols-outlined text-4xl mb-4 text-red-300">error</span>
        <p className="font-medium text-lg mb-2">Unable to load history</p>
        <p className="text-sm opacity-80">{error}</p>
      </div>
    )
  }

  if (historyItems.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-12 rounded-2xl text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-8">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-brand-navy mb-2">No History Found</h3>
        <p className="text-gray-500 max-w-sm">
          You haven't completed any quizzes or practice sets yet. Head over to the Templates or Quizzes tab to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Dynamic Topic Analytics Dashboard placed organically at the very top */}
      <QuizCategoryAnalysisBlock />

      {/* Header Stat row */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900">Your Recent Graded Attempts</h2>
        <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
          {historyItems.length} Records
        </span>
      </div>

      <div data-role="quiz-history-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {historyItems.map((item) => (
          <QuizHistoryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
