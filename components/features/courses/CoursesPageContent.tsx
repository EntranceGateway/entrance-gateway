'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchCourses } from '@/services/client/courses.client'
import { CenteredSpinner } from '@/components/shared/Loading'
import { useToast } from '@/components/shared/Toast'
import type { Course } from '@/types/courses.types'

interface CoursesPageContentProps {
  initialData?: Course[] | null
  initialError?: string | null
  initialTotalPages?: number
}

export function CoursesPageContent({ 
  initialData, 
  initialError,
  initialTotalPages = 0 
}: CoursesPageContentProps) {
  const { showToast } = useToast()
  const [courses, setCourses] = useState<Course[]>(initialData || [])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialError || null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(initialTotalPages)

  // Show error toast on mount if there's an initial error
  useEffect(() => {
    if (initialError) {
      showToast(initialError, 'error')
    }
  }, [initialError, showToast])

  useEffect(() => {
    // Skip initial load if we have SSR data and no page change
    if (initialData && currentPage === 0) {
      return
    }

    loadCourses()
  }, [currentPage])

  const loadCourses = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetchCourses({
        page: currentPage,
        size: 10,
        sortBy: 'courseName',
        sortDir: 'asc',
      })

      setCourses(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load courses'
      setError(errorMessage)
      setCourses([])
      showToast(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Show error state
  if (error && !isLoading && courses.length === 0) {
    return (
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-brand-navy mb-8 font-heading">Courses</h1>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-12 text-red-400 mx-auto mb-4">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Courses</h3>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null)
                loadCourses()
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
  if (isLoading && !courses.length) {
    return (
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-brand-navy mb-8 font-heading">Courses</h1>
          <CenteredSpinner size="lg" text="Loading courses..." />
        </div>
      </main>
    )
  }

  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy mb-2 sm:mb-3 font-heading">
            Courses
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Explore various courses offered by colleges and universities
          </p>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-12 text-gray-300 mx-auto mb-4">
              <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-sm text-gray-500">Check back later for available courses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {courses.map((course) => (
              <CourseCard key={course.courseId} course={course} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
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

// Course Card Component
function CourseCard({ course }: { course: Course }) {
  const collegeCount = course.collegeResponses?.length || 0

  return (
    <Link
      href={`/courses/${course.slug || course.courseId}`}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-4 sm:p-6 group"
    >
      {/* Course Name */}
      <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2 font-heading group-hover:text-brand-blue transition-colors">
        {course.courseName}
      </h3>

      {/* Affiliation */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-3">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-brand-gold">
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
        </svg>
        <span>{course.affiliation.replace(/_/g, ' ')}</span>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-3">
        {course.description}
      </p>

      {/* Course Details */}
      <div className="flex items-center justify-between text-xs sm:text-sm mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-1.5 text-gray-600">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-brand-blue">
            <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
          </svg>
          <span>{course.courseLevel}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-brand-blue">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z" />
          </svg>
          <span>{course.courseType}</span>
        </div>
      </div>

      {/* Colleges Count */}
      <div className="flex items-center justify-between">
        {collegeCount > 0 && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-brand-blue font-medium">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>Available at {collegeCount} {collegeCount === 1 ? 'college' : 'colleges'}</span>
          </div>
        )}
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-gray-400 group-hover:text-brand-blue group-hover:translate-x-1 transition-all ml-auto">
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
        </svg>
      </div>
    </Link>
  )
}
