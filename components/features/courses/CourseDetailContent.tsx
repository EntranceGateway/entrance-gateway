'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CenteredSpinner } from '@/components/shared/Loading'
import { useResourceImage } from '@/hooks/api/useResourceImage'
import { fetchCourseById } from '@/services/client/courses.client'
import { useToast } from '@/components/shared/Toast'
import type { Course, CourseDetailResponse } from '@/types/courses.types'

interface CourseDetailContentProps {
  courseId: string
  initialData?: CourseDetailResponse | null
}

export function CourseDetailContent({ courseId, initialData }: CourseDetailContentProps) {
  const { showToast } = useToast()
  const [course, setCourse] = useState<Course | null>(initialData?.data || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch course data (skip if we have SSR data)
  useEffect(() => {
    // If we have initial data, don't fetch
    if (initialData) {
      return
    }

    // Only fetch if we don't have course data
    if (!course) {
      const loadCourse = async () => {
        setIsLoading(true)
        setError(null)

        try {
          const response = await fetchCourseById(courseId)
          setCourse(response.data)
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load course'
          setError(errorMessage)
          showToast(errorMessage, 'error')
        } finally {
          setIsLoading(false)
        }
      }

      loadCourse()
    }
  }, [courseId, initialData, course, showToast])

  // Loading State
  if (isLoading) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <CenteredSpinner size="lg" text="Loading course..." />
        </div>
      </main>
    )
  }

  // Error State
  if (error || !course) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 text-red-600 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <div>
                <h3 className="font-bold text-lg text-red-900 mb-1">Failed to load course</h3>
                <p className="text-sm text-red-700">{error || 'Course not found'}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-900"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Back to Courses
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const colleges = course.collegeResponses || []

  return (
    <main className="flex-grow w-full">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-navy to-brand-blue text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-10 md:py-14 lg:py-16">
          {/* Breadcrumb */}
          <nav className="mb-3 sm:mb-4 md:mb-6">
            <ol className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <li>
                <Link href="/courses" className="text-white/70 hover:text-white transition-colors">
                  Courses
                </Link>
              </li>
              <li className="text-white/50">/</li>
              <li className="text-white font-medium truncate max-w-[200px] sm:max-w-none">{course.courseName}</li>
            </ol>
          </nav>

          {/* Course Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-5 font-heading leading-tight">
            {course.courseName}
          </h1>

          {/* Course Meta */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-xs sm:text-sm md:text-base">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 sm:size-4 md:size-5 text-brand-gold shrink-0">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
              </svg>
              <span className="truncate">{course.affiliation.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 sm:size-4 md:size-5 text-brand-gold shrink-0">
                <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
              </svg>
              <span>{course.courseLevel}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 sm:size-4 md:size-5 text-brand-gold shrink-0">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z" />
              </svg>
              <span>{course.courseType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* About Section */}
            <section className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm border border-gray-200">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-navy mb-3 sm:mb-4 flex items-center gap-2 font-heading">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5 md:size-6 shrink-0">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                About the Course
              </h2>
              <div className="prose max-w-none text-gray-600">
                <p className="text-sm sm:text-base md:text-base leading-relaxed sm:leading-relaxed md:leading-loose whitespace-pre-line">
                  {course.description}
                </p>
              </div>
            </section>

            {/* Admission Criteria */}
            <section className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm border border-gray-200">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-navy mb-3 sm:mb-4 flex items-center gap-2 font-heading">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5 md:size-6 shrink-0">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                Admission Criteria
              </h2>
              <div className="bg-gray-50 p-3 sm:p-4 md:p-5 rounded-lg">
                <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed sm:leading-relaxed md:leading-loose whitespace-pre-line">
                  {course.criteria}
                </p>
              </div>
            </section>

            {/* Colleges Offering This Course */}
            {colleges.length > 0 && (
              <section>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-navy mb-3 sm:mb-4 md:mb-6 flex items-center gap-2 font-heading">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5 md:size-6 shrink-0">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <span>Colleges Offering This Course ({colleges.length})</span>
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
                  {colleges.map((college) => (
                    <CollegeCard key={college.collegeId} college={college} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-3 sm:space-y-4 md:space-y-6">
              {/* Quick Info */}
              <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-200">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Course Details</h3>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Course Level</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{course.courseLevel}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Course Type</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{course.courseType}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Affiliation</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base break-words">{course.affiliation.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Available Colleges</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{colleges.length} {colleges.length === 1 ? 'College' : 'Colleges'}</p>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <Link
                href="/courses"
                className="block w-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-brand-navy font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-center text-sm sm:text-base"
              >
                ← Back to All Courses
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

// College Card Component
function CollegeCard({ college }: { college: any }) {
  const { src: logoSrc } = useResourceImage(college.logoName || null, {
    enabled: !!college.logoName,
  })

  return (
    <Link
      href={`/colleges/${college.slug || college.collegeId}`}
      className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-3 sm:p-4 md:p-6 group"
    >
      <div className="flex gap-2.5 sm:gap-3 md:gap-4">
        {/* Logo */}
        <div className="shrink-0">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={college.collegeName}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg bg-gradient-to-br from-brand-navy to-brand-blue flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 sm:size-6 md:size-8 text-white/30">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 group-hover:text-brand-blue transition-colors line-clamp-1">
            {college.collegeName}
          </h3>
          <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-3 sm:size-3.5 md:size-4 text-gray-400 shrink-0">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className="truncate">{college.location}</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">{college.description}</p>
        </div>

        {/* Arrow */}
        <div className="shrink-0 self-center">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5 text-gray-400 group-hover:text-brand-blue group-hover:translate-x-1 transition-all">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
