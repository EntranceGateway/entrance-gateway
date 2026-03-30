'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { TrainingsHeader } from './TrainingsHeader'
import { TrainingsCard, TrainingsCardGrid } from './TrainingsCard'
import { CardGridSkeleton } from '@/components/shared/Loading'
import { fetchTrainings } from '@/services/client/trainings.client'
import type { Training, TrainingsListResponse } from '@/types/trainings.types'

interface TrainingsPageContentProps {
  initialData?: TrainingsListResponse | null
  initialPage?: number
}

export function TrainingsPageContent({ initialData, initialPage = 0 }: TrainingsPageContentProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [trainings, setTrainings] = useState<Training[]>(initialData?.data.content || [])
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(initialData?.data.totalPages || 1)

  useEffect(() => {
    setCurrentPage(initialPage)
    setTrainings(initialData?.data.content || [])
    setTotalPages(initialData?.data.totalPages || 1)
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

    const loadTrainings = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchTrainings({
          page: currentPage,
          size: 12,
          sortBy: 'trainingStatus',
          sortDir: 'asc',
        })
        setTrainings(response.data.content)
        setTotalPages(response.data.totalPages)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trainings')
      } finally {
        setIsLoading(false)
      }
    }

    loadTrainings()
  }, [currentPage, initialData, initialPage])

  const handleDownloadSyllabus = (id: number) => {
    const training = trainings.find(t => t.trainingId === id)
    if (training?.materialsLink) {
      window.open(training.materialsLink, '_blank')
    }
  }

  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex)
    updatePageUrl(pageIndex)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="flex-grow bg-gray-50">
      <div data-role="page-content" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <TrainingsHeader />

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

        <div data-role="training-list">
          {isLoading ? (
            <CardGridSkeleton count={4} />
          ) : !error && trainings.length === 0 ? (
            <div className="text-center py-12">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="size-16 mx-auto text-gray-300 mb-4"
              >
                <path
                  d="M12 14l9-5-9-5-9 5 9 5z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No trainings available</h3>
              <p className="text-gray-500">Check back soon for upcoming training programs.</p>
            </div>
          ) : !error ? (
            <TrainingsCardGrid>
              {trainings.map((training) => (
                <TrainingsCard
                  key={training.trainingId}
                  item={training}
                  onDownloadSyllabus={handleDownloadSyllabus}
                />
              ))}
            </TrainingsCardGrid>
          ) : null}
        </div>

        {!isLoading && !error && totalPages > 1 && trainings.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              id="trainings-pagination-prev"
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
              id="trainings-pagination-next"
              onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </main>
  )
}
