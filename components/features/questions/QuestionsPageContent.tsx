'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { fetchOldQuestions } from '@/services/client/questions.client'
import { QuestionsHeader } from './QuestionsHeader'
import { QuestionsFilters } from './QuestionsFilters'
import { QuestionsTable } from './QuestionsTable'
import { QuestionsPagination } from './QuestionsPagination'
import { CenteredSpinner } from '@/components/shared/Loading'
import { useToast } from '@/components/shared/Toast'
import type { OldQuestion } from '@/types/questions.types'

interface QuestionsPageContentProps {
  initialData?: OldQuestion[] | null
  initialError?: string | null
  initialTotalPages?: number
  initialPage?: number
}

export function QuestionsPageContent({
  initialData,
  initialError,
  initialTotalPages = 0,
  initialPage = 0,
}: QuestionsPageContentProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  const [questions, setQuestions] = useState<OldQuestion[]>(initialData || [])
  const [isLoading, setIsLoading] = useState(!initialData && !initialError)
  const [error, setError] = useState<string | null>(initialError || null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(initialTotalPages)

  useEffect(() => {
    if (!selectedCourse && !selectedYear) {
      setCurrentPage(initialPage)
      setQuestions(initialData || [])
      setTotalPages(initialTotalPages)
      setIsLoading(false)
      setError(initialError || null)
    }
  }, [initialData, initialError, initialPage, initialTotalPages, selectedCourse, selectedYear])

  const updatePageUrl = (pageIndex: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(pageIndex + 1))
    params.set('size', '10')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    if (initialError) {
      showToast(initialError, 'error')
    }
  }, [initialError, showToast])

  useEffect(() => {
    if (initialData && !searchQuery && !selectedCourse && !selectedYear && currentPage === initialPage) {
      return
    }

    loadQuestions()
  }, [currentPage, selectedCourse, selectedYear, initialData, initialPage, searchQuery])

  const loadQuestions = async (pageOverride = currentPage) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchOldQuestions({
        page: pageOverride,
        size: 10,
        sortBy: 'year',
        sortDir: 'desc',
        courseName: selectedCourse || undefined,
        year: selectedYear ? parseInt(selectedYear) : undefined,
      })

      setQuestions(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load questions'
      setError(errorMessage)
      setQuestions([])
      showToast(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSearchQuery('')
    setSelectedCourse('')
    setSelectedYear('')
    setCurrentPage(0)
    setError(null)
    updatePageUrl(0)
  }

  const filteredQuestions = questions.filter(q =>
    searchQuery === '' ||
    q.setName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (error && !isLoading && questions.length === 0) {
    return (
      <main className="flex-grow">
        <div data-role="page-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <QuestionsHeader />

          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-12 text-red-400 mx-auto mb-4">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Questions</h3>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null)
                loadQuestions()
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (isLoading && !questions.length) {
    return (
      <main className="flex-grow">
        <div data-role="page-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <QuestionsHeader />
          <CenteredSpinner size="lg" text="Loading questions..." />
        </div>
      </main>
    )
  }

  return (
    <main className="flex-grow">
      <div data-role="page-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QuestionsHeader />

        <QuestionsFilters
          searchQuery={searchQuery}
          selectedCourse={selectedCourse}
          selectedYear={selectedYear}
          onSearchChange={setSearchQuery}
          onCourseChange={setSelectedCourse}
          onYearChange={setSelectedYear}
          onReset={handleReset}
        />

        <div data-role="question-list">
          <QuestionsTable data={filteredQuestions} isLoading={isLoading} />
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-end">
            <QuestionsPagination
              currentPage={currentPage + 1}
              totalPages={totalPages}
              onPageChange={(page) => {
                const nextPage = page - 1
                setCurrentPage(nextPage)
                updatePageUrl(nextPage)
              }}
            />
          </div>
        )}
      </div>
    </main>
  )
}
