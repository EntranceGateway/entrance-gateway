import { Suspense } from 'react'
import { SyllabusPageContent } from '@/components/features/syllabus/SyllabusPageContent'
import { getCourses, getFullSyllabus } from '@/services/server/courses.server'
import { getSyllabusList } from '@/services/server/syllabus.server'
import { mapCourseToSyllabusListItem } from '@/types/syllabus-list.types'

export const metadata = {
  title: 'Academic Syllabus Directory - EntranceGateway',
  description: 'Access and download the latest curriculum documents for all university programs.',
}

export default async function SyllabusPage() {
  const coursesResponse = await getCourses({ page: 0, size: 100 }).catch(() => null)
  const courses = coursesResponse?.data.content || []

  const syllabusResponses = await Promise.all(
    courses.map((course) => getFullSyllabus(course.courseId).catch(() => null))
  )

  const syllabusListResponse = await getSyllabusList().catch(() => null)
  const syllabusSlugMap = Object.fromEntries(
    (syllabusListResponse?.data.content || []).map((item) => [item.syllabusId, item.slug])
  )

  const syllabusPageData = {
    courses: courses.map((course, index) =>
      mapCourseToSyllabusListItem(course, syllabusResponses[index], syllabusSlugMap)
    ),
    totalCourses: coursesResponse?.data.totalElements || courses.length,
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SyllabusPageContent initialData={syllabusPageData} />
    </Suspense>
  )
}
