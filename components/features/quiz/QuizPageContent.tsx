'use client'

import { useState, useEffect } from 'react'
import { QuizHeader } from './QuizHeader'
import { QuizCard, QuizCardGrid } from './QuizCard'
import { QuizDetailSidebar } from './QuizDetailSidebar'
import { QuizPaymentForm } from './QuizPaymentForm'
import { CardGridSkeleton } from '@/components/shared/Loading'
import { fetchQuizzes } from '@/services/client/quiz.client'
import { checkPurchaseStatus } from '@/services/client/payment.client'
import type { Quiz, QuizListResponse } from '@/types/quiz.types'
import type { PurchaseStatus } from '@/types/payment.types'

interface QuizPageContentProps {
  initialData?: QuizListResponse | null
}

export function QuizPageContent({ initialData }: QuizPageContentProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>(
    initialData?.data?.content || []
  )
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>('NOT_PURCHASED')
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false)

  // Load quizzes from API
  useEffect(() => {
    // Skip initial load if we have SSR data
    if (initialData) return

    const loadQuizzes = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchQuizzes({
          page: 0,
          size: 12,
          sortBy: 'setName',
          sortDir: 'asc',
        })
        
        // Defensive check for response structure
        if (response?.data?.content && Array.isArray(response.data.content)) {
          setQuizzes(response.data.content)
        } else {
          setError('Invalid response format')
        }
      } catch (err) {
        // Don't leak internal error details
        console.error('Error loading quizzes:', err)
        setError('Unable to load quizzes. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    loadQuizzes()
  }, [initialData])

  const handleQuizClick = async (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setIsSidebarOpen(true)
    setPurchaseStatus('NOT_PURCHASED') // Reset to default

    // Check purchase status - errors are handled silently
    try {
      const statusResponse = await checkPurchaseStatus(quiz.questionSetId)
      setPurchaseStatus(statusResponse.data.status)
    } catch (err) {
      // Silent error - already logged in service, keep default NOT_PURCHASED status
      // This ensures the UI always shows a valid state even if the API fails
    }
  }

  const handleAddToCart = (quiz: Quiz) => {
    // TODO: Implement add to cart functionality
    // For now, just show a success message
    alert(`Added "${quiz.setName}" to cart!`)
    
    // In production, this would:
    // 1. Call API to add item to cart
    // 2. Update cart count in header
    // 3. Show toast notification
    // 4. Optionally redirect to cart page
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
    setTimeout(() => setSelectedQuiz(null), 300)
  }

  const handleOpenPaymentForm = () => {
    setIsSidebarOpen(false)
    setIsPaymentFormOpen(true)
  }

  const handleClosePaymentForm = () => {
    setIsPaymentFormOpen(false)
    setTimeout(() => setSelectedQuiz(null), 300)
  }

  return (
    <main className="flex-grow bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <QuizHeader />

        {/* Error State */}
        {error && (
          <div className="bg-semantic-error/10 border border-semantic-error text-semantic-error p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <CardGridSkeleton count={6} />}

        {/* Empty State */}
        {!isLoading && !error && quizzes.length === 0 && (
          <div className="text-center py-12">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-16 mx-auto text-gray-300 mb-4"
            >
              <path
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No quizzes available</h3>
            <p className="text-gray-500">Check back soon for new quizzes.</p>
          </div>
        )}

        {/* Quizzes Grid */}
        {!isLoading && !error && quizzes.length > 0 && (
          <QuizCardGrid>
            {quizzes.map((quiz) => (
              <QuizCard 
                key={quiz.questionSetId} 
                item={quiz} 
                onClick={() => handleQuizClick(quiz)}
                onAddToCart={handleAddToCart}
              />
            ))}
          </QuizCardGrid>
        )}
      </div>

      {/* Detail Sidebar */}
      <QuizDetailSidebar
        quiz={selectedQuiz}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        purchaseStatus={purchaseStatus}
      />

      {/* Payment Form Modal */}
      {isPaymentFormOpen && selectedQuiz && (
        <QuizPaymentForm quiz={selectedQuiz} onClose={handleClosePaymentForm} />
      )}
    </main>
  )
}
