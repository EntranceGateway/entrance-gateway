'use client'

import { useState, useEffect } from 'react'
import { fetchColleges } from '@/services/client/colleges.client'
import { CollegesHeader } from './CollegesHeader'
import { CollegesSearch } from './CollegesSearch'
import { CollegesFilters } from './CollegesFilters'
import { CollegesCard, CollegesCardGrid } from './CollegesCard'
import { CollegesPagination } from './CollegesPagination'
import { CenteredSpinner } from '@/components/shared/Loading'
import { useToast } from '@/components/shared/Toast'
import type { College } from '@/types/colleges.types'

interface CollegesPageContentProps {
  initialData?: College[] | null
  initialError?: string | null
  initialTotalPages?: number
}

export function CollegesPageContent({ 
  initialData, 
  initialError,
  initialTotalPages = 0 
}: CollegesPageContentProps) {
  const { showToast } = useToast()
  const [colleges, setColleges] = useState<College[]>(initialData || [])
  const [isLoading, setIsLoading] = useState(!initialData && !initialError)
  const [error, setError] = useState<string | null>(initialError || null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  
  const [categories, setCategories] = useState([
    { id: 'all', label: 'All Institutes', checked: true },
    { id: 'engineering', label: 'Engineering', checked: false },
    { id: 'medical', label: 'Medical', checked: false },
    { id: 'management', label: 'Management', checked: false },
    { id: 'it', label: 'IT & Computing', checked: false },
  ])

  const [locations, setLocations] = useState([
    { id: 'kathmandu', label: 'Kathmandu', checked: false },
    { id: 'lalitpur', label: 'Lalitpur', checked: false },
    { id: 'bhaktapur', label: 'Bhaktapur', checked: false },
    { id: 'pokhara', label: 'Pokhara', checked: false },
  ])

  // Show error toast on mount if there's an initial error
  useEffect(() => {
    if (initialError) {
      showToast(initialError, 'error')
    }
  }, [initialError, showToast])

  useEffect(() => {
    // Skip initial load if we have SSR data and no filters
    if (initialData && currentPage === 0) {
      return
    }

    loadColleges()
  }, [currentPage])

  const loadColleges = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetchColleges({
        page: currentPage,
        size: 10,
        sortBy: 'collegeName',
        sortDir: 'asc',
      })

      setColleges(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load colleges'
      setError(errorMessage)
      setColleges([])
      showToast(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, checked: !cat.checked } : cat
      )
    )
  }

  const handleLocationChange = (id: string) => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === id ? { ...loc, checked: !loc.checked } : loc
      )
    )
  }

  const handleReset = () => {
    setCategories((prev) =>
      prev.map((cat) => ({ ...cat, checked: cat.id === 'all' }))
    )
    setLocations((prev) => prev.map((loc) => ({ ...loc, checked: false })))
    setSearchQuery('')
    setCurrentPage(0)
    setError(null)
  }

  const handleFavorite = (id: number) => {
    showToast('Favorite feature coming soon!', 'info')
  }

  // Filter colleges by search query (client-side)
  const filteredColleges = colleges.filter(college => 
    searchQuery === '' || 
    college.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Show error state
  if (error && !isLoading && colleges.length === 0) {
    return (
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CollegesHeader />
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mt-8">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-12 text-red-400 mx-auto mb-4">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Colleges</h3>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null)
                loadColleges()
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

  // Show loading state
  if (isLoading && !colleges.length) {
    return (
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CollegesHeader />
          <CenteredSpinner size="lg" text="Loading colleges..." />
        </div>
      </main>
    )
  }

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header with Search */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <CollegesHeader />
          <CollegesSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Main Content: Filters + Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <CollegesFilters
            categories={categories}
            locations={locations}
            onCategoryChange={handleCategoryChange}
            onLocationChange={handleLocationChange}
            onReset={handleReset}
          />

          {/* Colleges Grid */}
          <div className="flex-grow">
            {filteredColleges.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-12 text-gray-300 mx-auto mb-4">
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No colleges found</h3>
                <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <>
                <CollegesCardGrid>
                  {filteredColleges.map((college) => (
                    <CollegesCard
                      key={college.collegeId}
                      item={college}
                      onFavorite={handleFavorite}
                    />
                  ))}
                </CollegesCardGrid>

                {/* Pagination */}
                {totalPages > 1 && (
                  <CollegesPagination
                    currentPage={currentPage + 1}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page - 1)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
