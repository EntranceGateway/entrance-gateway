'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { SyllabusCourseListItem } from '@/types/syllabus-list.types'

interface SyllabusAccordionProps {
  courses: SyllabusCourseListItem[]
  totalCourses: number
}

export function SyllabusAccordion({ courses, totalCourses }: SyllabusAccordionProps) {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(courses[0]?.courseId.toString() || null)
  const [expandedSemester, setExpandedSemester] = useState<string | null>(null)

  const normalizedCourses = useMemo(
    () => courses.map((course) => ({
      ...course,
      affiliationLabel: course.affiliation.replace(/_/g, ' '),
      courseIdString: course.courseId.toString(),
    })),
    [courses]
  )

  const handleCourseClick = (courseId: string) => {
    setExpandedCourse((current) => (current === courseId ? null : courseId))
    setExpandedSemester(null)
  }

  const handleSemesterClick = (semesterId: string) => {
    setExpandedSemester((current) => (current === semesterId ? null : semesterId))
  }

  if (normalizedCourses.length === 0) {
    return (
      <div data-role="course-list" className="space-y-3">
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
      </div>
    )
  }

  return (
    <div data-role="course-list" className="space-y-3">
      <div className="sr-only" data-role="pagination-status">
        Showing {normalizedCourses.length} of {totalCourses} courses
      </div>

      {normalizedCourses.map((course) => {
        const isCourseExpanded = expandedCourse === course.courseIdString

        return (
          <article
            key={course.courseId}
            data-role="course-item"
            data-course-name={course.courseName}
            data-course-affiliation={course.affiliationLabel}
            data-detail-uri={course.detailUri}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
          >
            <button
              onClick={() => handleCourseClick(course.courseIdString)}
              className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-brand-navy/10 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 sm:size-6 text-brand-navy">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 data-role="course-name" className="text-base sm:text-lg font-bold text-brand-navy truncate transition-colors duration-200">
                    {course.courseName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <code data-role="course-code" className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded transition-colors duration-200">
                      {course.slug}
                    </code>
                    <span data-role="affiliation" className="text-xs text-gray-500">
                      {course.affiliationLabel}
                    </span>
                  </div>
                </div>
              </div>
              <div className="shrink-0 ml-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`size-5 text-gray-400 transition-all duration-300 ${
                    isCourseExpanded ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </svg>
              </div>
            </button>

            <div
              className={`border-t border-gray-200 bg-gray-50 transition-all duration-300 ease-in-out ${
                isCourseExpanded ? 'max-h-[4000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              <div className="px-4 sm:px-6 py-3 space-y-4">
                {course.years.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-6 text-sm text-gray-500">
                    No syllabus subjects are currently available for this course.
                  </div>
                ) : (
                  course.years.map((year) => (
                    <div key={`${course.courseId}-${year.yearNumber}`} className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-px bg-gray-300 flex-1"></div>
                        <h4 data-role="year" className="text-sm font-bold text-gray-700 px-2">
                          {year.yearName}
                        </h4>
                        <div className="h-px bg-gray-300 flex-1"></div>
                      </div>

                      {year.semesters.map((semester) => {
                        const semesterId = `${course.courseId}-${year.yearNumber}-${semester.semesterNumber}`
                        const isSemesterExpanded = expandedSemester === semesterId

                        return (
                          <section
                            key={semesterId}
                            data-role="semester-item"
                            data-semester={semester.semesterName}
                            data-year={year.yearName}
                            className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:border-brand-blue/30"
                          >
                            <button
                              onClick={() => handleSemesterClick(semesterId)}
                              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 text-left cursor-pointer"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="shrink-0 w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110">
                                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-brand-blue">
                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                                  </svg>
                                </div>
                                <span data-role="semester-name" className="text-sm sm:text-base font-semibold text-gray-900 truncate transition-colors duration-200">
                                  {semester.semesterName}
                                </span>
                                <span className="text-xs text-gray-500">({semester.subjects.length} subjects)</span>
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

                            <div
                              className={`border-t border-gray-200 bg-gray-50 transition-all duration-300 ease-in-out ${
                                isSemesterExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                              }`}
                            >
                              <div className="divide-y divide-gray-200">
                                {semester.subjects.map((subject) => {
                                  const subjectIdentifier = subject.slug || String(subject.syllabusId)
                                  const detailUri = `/syllabus/${subjectIdentifier}`

                                  return (
                                    <Link
                                      key={`${semesterId}-${subject.syllabusId}`}
                                      href={detailUri}
                                      data-role="syllabus-link"
                                      data-detail-uri={detailUri}
                                      data-subject-name={subject.subjectName}
                                      data-subject-code={subject.subjectCode}
                                      data-credits={subject.credits}
                                      className="w-full px-4 py-3 hover:bg-white transition-all duration-200 text-left group block cursor-pointer"
                                    >
                                      <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <code data-role="subject-code" className="text-xs font-mono text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 transition-colors duration-200 group-hover:border-brand-blue/30">
                                              {subject.subjectCode}
                                            </code>
                                            <span data-role="credit-hours" className="text-xs text-gray-500">
                                              {subject.credits} Credit Hours
                                            </span>
                                            <span data-role="semester-name" className="sr-only">
                                              {semester.semesterName}
                                            </span>
                                            <span data-role="year" className="sr-only">
                                              {year.yearName}
                                            </span>
                                          </div>
                                          <p data-role="subject-name" className="text-sm font-medium text-gray-900 group-hover:text-brand-blue transition-colors duration-200">
                                            {subject.subjectName}
                                          </p>
                                        </div>
                                        <svg
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                          className="size-5 text-gray-400 group-hover:text-brand-blue group-hover:translate-x-1 transition-all duration-200 shrink-0"
                                        >
                                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                                        </svg>
                                      </div>
                                    </Link>
                                  )
                                })}
                              </div>
                            </div>
                          </section>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
