// Syllabus API Types

export interface Syllabus {
  syllabusId: number
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

// Error response type
export interface ApiErrorResponse {
  message: string
  data: null
}
