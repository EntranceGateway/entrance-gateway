'use client'

import { useState, useEffect } from 'react'
import { NotesHeader } from './NotesHeader'
import { NotesFilters } from './NotesFilters'
import { NotesCard, NotesCardGrid } from './NotesCard'
import { NotesPagination } from './NotesPagination'
import { CardGridSkeleton } from '@/components/shared/Loading'
import { fetchNotes } from '@/services/client/notes.client'
import type { Note, NotesListResponse } from '@/types/notes.types'

interface NotesPageContentProps {
  initialData?: NotesListResponse | null
}

export function NotesPageContent({ initialData }: NotesPageContentProps) {
  const [notes, setNotes] = useState<Note[]>(initialData?.data.content || [])
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
    
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(0) // API uses 0-based indexing
  const [totalElements, setTotalElements] = useState(initialData?.data.totalElements || 0)
  const [totalPages, setTotalPages] = useState(initialData?.data.totalPages || 0)
  const [pageSize] = useState(9) // 9 items per page for 3-column grid

  // Fetch notes from API
  const loadNotes = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        size: pageSize,
        sortBy: 'noteName',
        sortDir: 'asc',
      }

      // Add filters if selected
      if (selectedCourse) {
        params.courseName = selectedCourse
      }
      if (selectedSemester) {
        params.semester = parseInt(selectedSemester)
      }

      const response = await fetchNotes(params)
      setNotes(response.data.content)
      setTotalElements(response.data.totalElements)
      setTotalPages(response.data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes')
      console.error('Error fetching notes:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Load notes when filters/page change (skip initial load if we have SSR data)
  useEffect(() => {
    // Skip initial load if we have SSR data and no filters applied
    if (initialData && currentPage === 0 && !selectedCourse && !selectedSemester) {
      return
    }
    loadNotes()
  }, [currentPage, selectedCourse, selectedSemester])

  const handleFilter = () => {
    // Reset to first page when filtering
    setCurrentPage(0)
    loadNotes()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1) // Convert to 0-based for API
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NotesHeader />

        <NotesFilters
          searchQuery={searchQuery}
          selectedCourse={selectedCourse}
          selectedSemester={selectedSemester}
          onSearchChange={setSearchQuery}
          onCourseChange={setSelectedCourse}
          onSemesterChange={setSelectedSemester}
          onFilter={handleFilter}
        />

        {/* Error State */}
        {error && (
          <div className="bg-error/10 border border-error text-error p-4 rounded-lg mb-8">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <CardGridSkeleton count={9} />}

        {/* Empty State */}
        {!isLoading && !error && notes.length === 0 && (
          <div className="text-center py-12">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-16 mx-auto text-gray-300 mb-4"
            >
              <path
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
          </div>
        )}

        {/* Notes Grid */}
        {!isLoading && !error && notes.length > 0 && (
          <>
            <NotesCardGrid>
              {notes.map((note) => (
                <NotesCard
                  key={note.noteId}
                  item={note}
                />
              ))}
            </NotesCardGrid>

            <NotesPagination
              currentPage={currentPage + 1} // Convert back to 1-based for display
              totalItems={totalElements}
              totalPages={totalPages}
              itemsPerPage={pageSize}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </main>
  )
}
