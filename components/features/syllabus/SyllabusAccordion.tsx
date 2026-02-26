'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Spinner } from '@/components/shared/Loading'
import { fetchFullSyllabus } from '@/services/client/courses.client'
import type { Year, FullSyllabusResponse } from '@/types/courses.types'

interface Course {
  id: string
  name: string
  code: string
  affiliation: string
  description?: string
  years?: Year[] // API data
}

interface SyllabusAccordionProps {
  courses: Course[]
  searchQuery?: string
  firstCourseSyllabus?: FullSyllabusResponse | null
}

export function SyllabusAccordion({ courses, searchQuery = '', firstCourseSyllabus }: SyllabusAccordionProps) {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)
  const [expandedSemester, setExpandedSemester] = useState<string | null>(null)
  const [loadingCourse, setLoadingCourse] = useState<string | null>(null)
  const [courseData, setCourseData] = useState<Record<string, Year[]>>({})
  const [syllabusSlugMap, setSyllabusSlugMap] = useState<Record<number, string>>({})

  // Fetch syllabus list to get slug mapping
  useEffect(() => {
    const fetchSyllabusSlugMap = async () => {
      try {
        const response = await fetch('https://api.entrancegateway.com/api/v1/syllabus?page=0&size=1000')
        const data = await response.json()
        
        if (data.data?.content) {
          const slugMap: Record<number, string> = {}
          data.data.content.forEach((item: any) => {
            if (item.syllabusId && item.slug) {
              slugMap[item.syllabusId] = item.slug
            }
          })
          console.log('Syllabus slug map:', slugMap)
          setSyllabusSlugMap(slugMap)
        }
      } catch (error) {
        console.error('Error fetching syllabus slug map:', error)
      }
    }

    fetchSyllabusSlugMap()
  }, [])

  // Pre-populate first course's syllabus from SSR data
  useEffect(() => {
    if (firstCourseSyllabus && courses[0]) {
      console.log('=== Syllabus List Page - First Course Syllabus ===')
      console.log('First Course Syllabus:', firstCourseSyllabus)
      console.log('Years:', firstCourseSyllabus.data.years)
      
      setCourseData({
        [courses[0].id]: firstCourseSyllabus.data.years,
      })
    }
  }, [firstCourseSyllabus, courses])

  // Filter courses based on search
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCourseClick = async (courseId: string) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null)
      setExpandedSemester(null)
      return
    }

    setLoadingCourse(courseId)
    setExpandedCourse(courseId)
    setExpandedSemester(null)

    // Fetch full syllabus if not already loaded
    if (!courseData[courseId]) {
      try {
        console.log('Fetching full syllabus for course ID:', courseId)
        const response = await fetchFullSyllabus(parseInt(courseId))
        console.log('Full Syllabus Response:', response)
        console.log('Years data:', response.data.years)
        
        setCourseData(prev => ({
          ...prev,
          [courseId]: response.data.years,
        }))
      } catch (error) {
        console.error('Error fetching syllabus:', error)
      }
    }

    setLoadingCourse(null)
  }

  const handleSemesterClick = (semesterId: string) => {
    if (expandedSemester === semesterId) {
      setExpandedSemester(null)
      return
    }
    setExpandedSemester(semesterId)
  }

  if (filteredCourses.length === 0) {
    return (
      <div className="text-center py-12 animate-in fade-in duration-300">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="size-16 mx-auto text-gray-300 mb-4"
        >
          <path
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
        <p className="text-gray-500">Try adjusting your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredCourses.map((course) => {
        const isCourseExpanded = expandedCourse === course.id
        const isCourseLoading = loadingCourse === course.id
        const years = courseData[course.id] || []

        return (
          <div
            key={course.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
          >
            {/* Course Header */}
            <button
              onClick={() => handleCourseClick(course.id)}
              className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 text-left"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-brand-navy/10 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 sm:size-6 text-brand-navy">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-brand-navy truncate transition-colors duration-200">
                    {course.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded transition-colors duration-200">
                      {course.code}
                    </span>
                    <span className="text-xs text-gray-500">
                      {course.affiliation}
                    </span>
                  </div>
                </div>
              </div>
              <div className="shrink-0 ml-2">
                {isCourseLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`size-5 text-gray-400 transition-all duration-300 ${
                      isCourseExpanded ? 'rotate-180' : 'rotate-0'
                    }`}
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                  </svg>
                )}
              </div>
            </button>

            {/* Years and Semesters */}
            <div
              className={`border-t border-gray-200 bg-gray-50 transition-all duration-300 ease-in-out ${
                isCourseExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              <div className="px-4 sm:px-6 py-3 space-y-4">
                {years.map((year) => (
                  <div key={year.yearNumber} className="space-y-2">
                    {/* Year Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-px bg-gray-300 flex-1"></div>
                      <h4 className="text-sm font-bold text-gray-700 px-2">{year.yearName}</h4>
                      <div className="h-px bg-gray-300 flex-1"></div>
                    </div>

                    {/* Semesters */}
                    {year.semesters.map((semester) => {
                      const semesterId = `${course.id}-${year.yearNumber}-${semester.semesterNumber}`
                      const isSemesterExpanded = expandedSemester === semesterId

                      return (
                        <div key={semesterId} className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:border-brand-blue/30">
                          {/* Semester Header */}
                          <button
                            onClick={() => handleSemesterClick(semesterId)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 text-left"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="shrink-0 w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-brand-blue">
                                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                                </svg>
                              </div>
                              <span className="text-sm sm:text-base font-semibold text-gray-900 truncate transition-colors duration-200">
                                {semester.semesterName}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({semester.subjects.length} subjects)
                              </span>
                            </div>
                            <div className="shrink-0 ml-2">
                              <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className={`size-4 text-gray-400 transition-all duration-300 ${
                                  isSemesterExpanded ? 'rotate-180' : 'rotate-0'
                                }`}
                              >
                                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                              </svg>
                            </div>
                          </button>

                          {/* Subjects */}
                          <div
                            className={`border-t border-gray-200 bg-gray-50 transition-all duration-300 ease-in-out ${
                              isSemesterExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                            }`}
                          >
                            <div className="divide-y divide-gray-200">
                              {semester.subjects.map((subject, index) => {
                                const subjectKey = subject.syllabusId || `subject-${index}`
                                // Use slug from map if available, otherwise fallback to syllabusId
                                const subjectSlug = syllabusSlugMap[subject.syllabusId]
                                const subjectIdentifier = subjectSlug || subject.syllabusId
                                
                                console.log('Subject in list:', {
                                  syllabusId: subject.syllabusId,
                                  slug: subjectSlug,
                                  subjectName: subject.subjectName,
                                  identifier: subjectIdentifier
                                })
                                
                                return (
                                  <Link
                                    key={subjectKey}
                                    href={subjectIdentifier ? `/syllabus/${subjectIdentifier}` : '#'}
                                    className={`w-full px-4 py-3 hover:bg-white transition-all duration-200 text-left group block ${
                                      !subjectIdentifier ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-mono text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 transition-colors duration-200 group-hover:border-brand-blue/30">
                                            {subject.subjectCode}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {subject.credits} Credit Hours
                                          </span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 group-hover:text-brand-blue transition-colors duration-200">
                                          {subject.subjectName}
                                        </p>
                                      </div>
                                      {subjectIdentifier && (
                                        <svg
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                          className="size-5 text-gray-400 group-hover:text-brand-blue group-hover:translate-x-1 transition-all duration-200 shrink-0"
                                        >
                                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                                        </svg>
                                      )}
                                    </div>
                                  </Link>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
