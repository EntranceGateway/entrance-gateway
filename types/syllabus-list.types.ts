import type { Course, FullSyllabusResponse, Year } from './courses.types'
import type { Syllabus } from './syllabus.types'

export interface SyllabusSubjectListItem {
  syllabusId: number
  slug: string
  subjectName: string
  subjectCode: string
  credits: number
}

export interface SyllabusSemesterListItem {
  semesterId: number | null
  semesterNumber: number
  semesterName: string
  subjects: SyllabusSubjectListItem[]
}

export interface SyllabusYearListItem {
  yearNumber: number
  yearName: string
  semesters: SyllabusSemesterListItem[]
}

export interface SyllabusCourseListItem {
  courseId: number
  slug: string
  courseName: string
  description: string
  affiliation: Course['affiliation']
  courseType: Course['courseType']
  courseLevel: Course['courseLevel']
  detailUri: string
  years: SyllabusYearListItem[]
}

export interface SyllabusListPageData {
  courses: SyllabusCourseListItem[]
  totalCourses: number
}

export function mapCourseToSyllabusListItem(
  course: Course,
  syllabus: FullSyllabusResponse | null,
  syllabusSlugMap: Record<number, string> = {}
): SyllabusCourseListItem {
  return {
    courseId: course.courseId,
    slug: course.slug,
    courseName: course.courseName,
    description: course.description,
    affiliation: course.affiliation,
    courseType: course.courseType,
    courseLevel: course.courseLevel,
    detailUri: `/courses/${course.slug || course.courseId}`,
    years: (syllabus?.data.years || []).map((year: Year) => ({
      yearNumber: year.yearNumber,
      yearName: year.yearName,
      semesters: [...year.semesters]
        .sort((a, b) => a.semesterNumber - b.semesterNumber)
        .map((semester) => ({
          semesterId: semester.semesterId,
          semesterNumber: semester.semesterNumber,
          semesterName: semester.semesterName,
          subjects: semester.subjects.map((subject) => ({
            syllabusId: subject.syllabusId,
            slug: subject.slug || syllabusSlugMap[subject.syllabusId] || '',
            subjectName: subject.subjectName,
            subjectCode: subject.subjectCode,
            credits: subject.credits,
          })),
        })),
    })),
  }
}
