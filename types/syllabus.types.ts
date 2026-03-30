// Syllabus API Types

export interface Syllabus {
  syllabusId: number
  slug: string
  courseId: number
  syllabusTitle: string
  syllabusFile: string
  courseCode: string
  creditHours: number
  lectureHours: number
  practicalHours: number
  courseName: string
  semester: number
  year: number
  subjectName: string
}

export interface SyllabusDetailResponse {
  message: string
  data: Syllabus
}

export interface SyllabusListPayload {
  content: Syllabus[]
  totalElements: number
  totalPages: number
  pageNumber: number
  pageSize: number
  last: boolean
}

export interface SyllabusListResponse {
  message: string
  data: SyllabusListPayload
}

// Error response type
export interface ApiErrorResponse {
  message: string
  data: null
}
