'use client'

import { useState, useEffect } from 'react'
import { SyllabusHeader } from './SyllabusHeader'
import { SyllabusAccordion } from './SyllabusAccordion'
import { fetchCourses } from '@/services/client/courses.client'
import type { Course, CoursesListResponse, FullSyllabusResponse } from '@/types/courses.types'

interface SyllabusPageContentProps {
  initialData?: CoursesListResponse | null
  firstCourseSyllabus?: FullSyllabusResponse | null
}

export function SyllabusPageContent({ initialData, firstCourseSyllabus }: SyllabusPageContentProps) {
  const [courses, setCourses] = useState<Course[]>(initialData?.data.content || [])
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Load courses if no initial data
  useEffect(() => {
    if (initialData) return

    const loadCourses = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchCourses({ page: 0, size: 100 })
        setCourses(response.data.content)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load courses')
        console.error('Error fetching courses:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [initialData])

  // Transform API data to accordion format
  const transformedCourses = courses.map(course => ({
    id: course.courseId.toString(),
    name: course.courseName,
    code: course.courseName,
    affiliation: course.affiliation.replace(/_/g, ' '),
    description: course.description,
    semesters: [], // Will be loaded dynamically when course is expanded
  }))

  return (
    <main className="flex-grow bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <SyllabusHeader />

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <path
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by name or code..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm transition-all outline-none text-gray-700 placeholder-gray-400 shadow-sm"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-error/10 border border-error text-error p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div
                className="inline-block size-12 animate-spin rounded-full border-8 border-solid border-brand-blue border-r-transparent"
                role="status"
                aria-label="Loading courses"
              >
                <span className="sr-only">Loading courses...</span>
              </div>
              <p className="mt-4 text-sm text-gray-600">Loading courses...</p>
            </div>
          </div>
        )}

        {/* Accordion Navigation */}
        {!isLoading && !error && (
          <SyllabusAccordion 
            courses={transformedCourses} 
            searchQuery={searchQuery}
            firstCourseSyllabus={firstCourseSyllabus}
          />
        )}
      </div>
    </main>
  )
}
