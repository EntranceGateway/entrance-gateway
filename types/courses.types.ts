// Courses API Types - Matching backend response structure

export enum CourseLevel {
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER',
  DIPLOMA = 'DIPLOMA',
}

export enum CourseType {
  SEMESTER = 'SEMESTER',
  YEARLY = 'YEARLY',
}

export enum Affiliation {
  TRIBHUVAN_UNIVERSITY = 'TRIBHUVAN_UNIVERSITY',
  KATHMANDU_UNIVERSITY = 'KATHMANDU_UNIVERSITY',
  POKHARA_UNIVERSITY = 'POKHARA_UNIVERSITY',
  PURBANCHAL_UNIVERSITY = 'PURBANCHAL_UNIVERSITY',
}

export interface Course {
  courseId: number
  courseName: string
  description: string
  courseLevel: CourseLevel
  courseType: CourseType
  affiliation: Affiliation
  criteria: string
  collegeResponses: null | any[] // Can be typed later if needed
}

export interface CoursesListResponse {
  message: string
  data: {
    content: Course[]
    totalElements: number
    totalPages: number
    pageNumber: number
    pageSize: number
    last: boolean
  }
}

export interface CourseDetailResponse {
  message: string
  data: Course
}

export interface CoursesQueryParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

// Full Syllabus Types
export interface Subject {
  syllabusId: number
  subjectName: string
  subjectCode: string
  credits: number
}

export interface Semester {
  semesterId: number | null
  semesterNumber: number
  semesterName: string
  subjects: Subject[]
}

export interface Year {
  yearNumber: number
  yearName: string
  semesters: Semester[]
}

export interface FullSyllabus {
  courseId: number
  courseName: string
  years: Year[]
}

export interface FullSyllabusResponse {
  message: string
  data: FullSyllabus
}

// Error response type
export interface ApiErrorResponse {
  message: string
  data: null
}
