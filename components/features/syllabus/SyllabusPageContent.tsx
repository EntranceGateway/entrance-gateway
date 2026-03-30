'use client'

import { useMemo, useState } from 'react'
import { SyllabusHeader } from './SyllabusHeader'
import { SyllabusAccordion } from './SyllabusAccordion'
import type { SyllabusListPageData } from '@/types/syllabus-list.types'

interface SyllabusPageContentProps {
  initialData: SyllabusListPageData
}

export function SyllabusPageContent({ initialData }: SyllabusPageContentProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return initialData.courses
    }

    return initialData.courses.filter((course) =>
      course.courseName.toLowerCase().includes(normalizedQuery) ||
      course.slug.toLowerCase().includes(normalizedQuery)
    )
  }, [initialData.courses, searchQuery])

  return (
    <main className="flex-grow bg-gray-50">
      <div data-role="page-content" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <SyllabusHeader />

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
              placeholder="Search courses by name or slug..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue text-sm transition-all outline-none text-gray-700 placeholder-gray-400 shadow-sm"
            />
          </div>
        </div>

        <SyllabusAccordion courses={filteredCourses} totalCourses={initialData.totalCourses} />
      </div>
    </main>
  )
}
