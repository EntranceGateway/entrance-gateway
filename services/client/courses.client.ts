// Client-side Courses API calls (for CSR)
// Uses Next.js API routes as proxy to backend

import type {
  CoursesListResponse,
  CourseDetailResponse,
  CoursesQueryParams,
  FullSyllabusResponse,
} from '@/types/courses.types'

/**
 * Fetch paginated list of courses (Client-side via proxy)
 * Used in Client Components with useState/useEffect or React Query
 */
export async function fetchCourses(
  params: CoursesQueryParams = {}
): Promise<CoursesListResponse> {
  const {
    page = 0,
    size = 10,
    sortBy = 'courseName',
    sortDir = 'asc',
  } = params

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir,
  })

  const response = await fetch(`/api/courses?${queryParams}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetch single course by ID (Client-side via proxy)
 * Used in Client Components
 */
export async function fetchCourseById(id: string): Promise<CourseDetailResponse> {
  const response = await fetch(`/api/courses/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch course: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetch full syllabus for a course (Client-side via proxy)
 * Includes years, semesters, and subjects
 */
export async function fetchFullSyllabus(courseId: number): Promise<FullSyllabusResponse> {
  const response = await fetch(`/api/courses/full-syllabus/${courseId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch full syllabus: ${response.statusText}`)
  }

  return response.json()
}
