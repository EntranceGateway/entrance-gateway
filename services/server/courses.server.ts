// Server-side Courses API calls (for SSR)

import { apiClient } from '../api/client'
import type {
  CoursesListResponse,
  CourseDetailResponse,
  CoursesQueryParams,
  FullSyllabusResponse,
} from '@/types/courses.types'

/**
 * Fetch paginated list of courses (Server-side)
 * Used in Server Components for SSR
 */
export async function getCourses(
  params: CoursesQueryParams = {}
): Promise<CoursesListResponse> {
  const {
    page = 0,
    size = 10,
    sortBy = 'courseName',
    sortDir = 'asc',
  } = params

  return apiClient<CoursesListResponse>('/api/v1/courses', {
    params: {
      page,
      size,
      sortBy,
      sortDir,
    },
    cache: 'no-store',
  })
}

/**
 * Fetch single course by ID (Server-side)
 * Used in Server Components for SSR
 */
export async function getCourseById(id: string): Promise<CourseDetailResponse> {
  return apiClient<CourseDetailResponse>(`/api/v1/courses/${id}`, {
    cache: 'no-store',
  })
}

/**
 * Fetch full syllabus for a course (Server-side)
 * Includes years, semesters, and subjects
 */
export async function getFullSyllabus(courseId: number): Promise<FullSyllabusResponse> {
  return apiClient<FullSyllabusResponse>(`/api/v1/courses/full-syllabus/${courseId}`, {
    cache: 'no-store',
  })
}
