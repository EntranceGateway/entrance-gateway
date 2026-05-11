'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { fetchOldQuestions } from '@/services/client/questions.client'
import { QuestionsHeader } from './QuestionsHeader'
import { QuestionsFilters } from './QuestionsFilters'
import { QuestionsTable } from './QuestionsTable'
import { QuestionsPagination } from './QuestionsPagination'
import { CenteredSpinner } from '@/components/shared/Loading'
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
  const [questions, setQuestions] = useState<OldQuestion[]>(initialData || [])
  const [isLoading, setIsLoading] = useState(!initialData && !initialError)
  const [, setError] = useState<string | null>(null)
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
    } catch {
      setError(null)
      setQuestions([])
      setTotalPages(0)
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
