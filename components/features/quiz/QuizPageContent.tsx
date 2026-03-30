'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { QuizHeader } from './QuizHeader'
import { QuizCard, QuizCardGrid } from './QuizCard'
import { QuizDetailSidebar } from './QuizDetailSidebar'
import { QuizPaymentForm } from './QuizPaymentForm'
import { CardGridSkeleton } from '@/components/shared/Loading'
import { fetchQuizzes } from '@/services/client/quiz.client'
import { checkPurchaseStatus } from '@/services/client/payment.client'
import { addToCartAction } from '@/services/server/cart.server'
import { useToast } from '@/components/shared/Toast'
import { useAuth } from '@/hooks/auth/useAuth'
import type { Quiz, QuizListResponse } from '@/types/quiz.types'
import type { PurchaseStatus } from '@/types/payment.types'

interface QuizPageContentProps {
  initialData?: QuizListResponse | null
  purchaseStatuses?: Record<number, string>
  initialPage?: number
}

export function QuizPageContent({ initialData, purchaseStatuses = {}, initialPage = 0 }: QuizPageContentProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { success, error: showError } = useToast()
  const { isLoggedIn } = useAuth()
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialData?.data?.content || [])
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>('NOT_PURCHASED')
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(initialData?.data?.totalPages || 1)

  useEffect(() => {
    setCurrentPage(initialPage)
    setQuizzes(initialData?.data?.content || [])
    setTotalPages(initialData?.data?.totalPages || 1)
    setIsLoading(false)
    setError(null)
  }, [initialData, initialPage])

  const updatePageUrl = (pageIndex: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(pageIndex + 1))
    params.set('size', '12')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    if (initialData && currentPage === initialPage) return

    const loadQuizzes = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchQuizzes({
          page: currentPage,
          size: 12,
          sortBy: 'setName',
          sortDir: 'asc',
        })

        if (response?.data?.content && Array.isArray(response.data.content)) {
          setQuizzes(response.data.content)
          setTotalPages(response.data.totalPages)
        } else {
          setError('Invalid response format')
        }
      } catch {
        setError('Unable to load quizzes. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    loadQuizzes()
  }, [currentPage, initialData, initialPage])

  const handleQuizClick = async (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setIsSidebarOpen(true)

    const ssrStatus = purchaseStatuses[quiz.questionSetId]
    if (ssrStatus) {
      setPurchaseStatus(ssrStatus as PurchaseStatus)
    } else {
      setPurchaseStatus('NOT_PURCHASED')

      try {
        const statusResponse = await checkPurchaseStatus(quiz.questionSetId)
        setPurchaseStatus(statusResponse.data.status)
      } catch {
        // Keep default fallback state
      }
    }
  }

  const handleAddToCart = async (quiz: Quiz) => {
    if (!isLoggedIn) {
      showError('Please sign in to add items to cart')
      sessionStorage.setItem('redirectAfterLogin', '/quiz')
      router.push('/signin')
      return
    }

    if (quiz.price === 0) {
      showError('Free quizzes do not need to be added to cart')
      return
    }

    try {
      const result = await addToCartAction(quiz.questionSetId)

      if (result.success) {
        success(result.message)
        window.dispatchEvent(new Event('cartUpdated'))
        router.push(`/quiz/${quiz.slug}/payment`)
      } else {
        showError(result.message)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart'
      showError(errorMessage)
    }
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

  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex)
    updatePageUrl(pageIndex)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="flex-grow bg-gray-50">
      <div data-role="page-content" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <QuizHeader />

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

        <div data-role="quiz-list">
          {isLoading ? (
            <CardGridSkeleton count={6} />
          ) : !error && quizzes.length === 0 ? (
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
          ) : !error ? (
            <QuizCardGrid>
              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.questionSetId}
                  item={quiz}
                  onClick={() => handleQuizClick(quiz)}
                  onAddToCart={handleAddToCart}
                  purchaseStatus={(purchaseStatuses[quiz.questionSetId] as PurchaseStatus) || 'NOT_PURCHASED'}
                />
              ))}
            </QuizCardGrid>
          ) : null}
        </div>

        {!isLoading && !error && totalPages > 1 && quizzes.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              id="quiz-pagination-prev"
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span data-role="pagination-status" className="px-4 py-2 text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              id="quiz-pagination-next"
              onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

      </div>

      <QuizDetailSidebar
        quiz={selectedQuiz}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        purchaseStatus={purchaseStatus}
      />

      {isPaymentFormOpen && selectedQuiz && (
        <QuizPaymentForm quiz={selectedQuiz} onClose={handleClosePaymentForm} />
      )}
    </main>
  )
}
