'use client'

import { useState, useEffect } from 'react'
import { SimplePDFViewer } from '@/components/shared/SimplePDFViewer'
import { SyllabusDetailSidebar } from './SyllabusDetailSidebar'
import { SyllabusNavigation } from './SyllabusNavigation'
import { fetchSyllabusById } from '@/services/client/syllabus.client'
import type { SyllabusDetailResponse } from '@/types/syllabus.types'
import { Spinner } from '@/components/shared/Loading'

interface SyllabusDetailContentProps {
  syllabusSlug: string
  initialData?: SyllabusDetailResponse | null
}

export function SyllabusDetailContent({ syllabusSlug, initialData }: SyllabusDetailContentProps) {
  const [syllabusData, setSyllabusData] = useState(initialData?.data || null)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  // Console log initial data
  console.log('=== Syllabus Detail Page ===')
  console.log('Syllabus Slug/ID:', syllabusSlug)
  console.log('Initial Data:', initialData)
  console.log('Syllabus State:', syllabusData)
  console.log('Syllabus File (direct URL):', syllabusData?.syllabusFile)

  // Validate syllabusSlug (can be slug or id)
  if (!syllabusSlug || syllabusSlug === 'undefined' || syllabusSlug === 'null') {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-error/10 border border-error text-error p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <div>
                <h3 className="font-bold text-lg">Invalid Syllabus ID</h3>
                <p className="text-sm mt-1">The syllabus ID is missing or invalid. Please select a subject from the syllabus list.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // syllabusFile now contains the full signed URL
  const pdfUrl = syllabusData?.syllabusFile || null

  // Scroll to top on mount to prevent jumping to footer
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Load syllabus if no initial data
  useEffect(() => {
    if (initialData) return

    const loadSyllabus = async () => {
      setIsLoading(true)
      setError(null)

      try {
        console.log('Fetching syllabus with slug/id:', syllabusSlug)
        const response = await fetchSyllabusById(syllabusSlug)
        console.log('Fetched Syllabus Response:', response)
        console.log('Syllabus File URL:', response.data.syllabusFile)
        setSyllabusData(response.data)
      } catch (err) {
        console.error('Error fetching syllabus:', err)
        setError(err instanceof Error ? err.message : 'Failed to load syllabus')
      } finally {
        setIsLoading(false)
      }
    }

    loadSyllabus()
  }, [syllabusSlug, initialData])

  // Loading state
  if (isLoading) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-sm text-gray-600">Loading syllabus...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Error state
  if (error || !syllabusData) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-error/10 border border-error text-error p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <div>
                <h3 className="font-bold text-lg">Failed to load syllabus</h3>
                <p className="text-sm mt-1">{error || 'Syllabus not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-grow">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Page Heading */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-brand-navy text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-2 font-heading">
            {syllabusData.syllabusTitle}
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="bg-brand-gold/20 text-brand-navy px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
              {syllabusData.courseName}
            </span>
            <p className="text-gray-600 text-sm sm:text-base font-normal">
              Course Code: {syllabusData.courseCode} | Semester {syllabusData.semester} | Year {syllabusData.year}
            </p>
          </div>
        </div>

        {/* Main Content - PDF Viewer First (Mobile Priority) */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* PDF Viewer - Full width on mobile, 8 cols on desktop */}
          <div className="w-full lg:col-span-8 order-1 flex flex-col gap-6">
            {/* PDF Viewer - syllabusFile now contains the full signed URL */}
            {pdfUrl ? (
              <SimplePDFViewer pdfUrl={pdfUrl} isLoading={false} error={null} />
            ) : (
              <div className="bg-gray-50 border border-gray-200 text-gray-600 p-6 rounded-lg text-center">
                <p>No PDF file available</p>
              </div>
            )}

            {/* Navigation */}
            {/* Navigation removed - slug-based navigation doesn't support prev/next */}
          </div>

          {/* Sidebar - Below PDF on mobile, side on desktop */}
          <div className="w-full lg:col-span-4 order-2">
            <SyllabusDetailSidebar
              info={{
                code: syllabusData.courseCode,
                creditHours: syllabusData.creditHours,
                lectureHours: syllabusData.lectureHours,
                practicalHours: syllabusData.practicalHours,
                program: syllabusData.courseName,
                semester: `Semester ${syllabusData.semester}`,
                year: syllabusData.year,
                subjectName: syllabusData.subjectName,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
