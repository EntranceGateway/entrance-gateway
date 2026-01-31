import { Suspense } from 'react'
import { SyllabusPageContent } from '@/components/features/syllabus/SyllabusPageContent'
import { getCourses, getFullSyllabus } from '@/services/server/courses.server'

export const metadata = {
  title: 'Academic Syllabus Directory - EntranceGateway',
  description: 'Access and download the latest curriculum documents for all university programs.',
}

export default async function SyllabusPage() {
  // Fetch courses on server
  const initialData = await getCourses({ page: 0, size: 100 }).catch(() => null)

  // Pre-fetch first course's full syllabus for better UX
  let firstCourseSyllabus = null
  if (initialData?.data.content[0]) {
    firstCourseSyllabus = await getFullSyllabus(initialData.data.content[0].courseId).catch(() => null)
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SyllabusPageContent 
        initialData={initialData} 
        firstCourseSyllabus={firstCourseSyllabus}
      />
    </Suspense>
  )
}
