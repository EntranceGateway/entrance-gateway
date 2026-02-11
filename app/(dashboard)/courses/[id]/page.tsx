import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { CourseDetailContent } from '@/components/features/courses/CourseDetailContent'
import { CenteredSpinner } from '@/components/shared/Loading'
import { getCourseById } from '@/services/server/courses.server'
import type { Metadata } from 'next'

interface CourseDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
  const { id } = await params
  
  // Validate ID
  if (!id || id === 'undefined') {
    return {
      title: 'Course Not Found | EntranceGateway',
      description: 'The requested course could not be found.',
    }
  }

  try {
    const response = await getCourseById(id)
    const course = response.data

    return {
      title: `${course.courseName} - ${course.affiliation.replace(/_/g, ' ')} | EntranceGateway`,
      description: course.description || `Explore ${course.courseName} course details, admission criteria, and colleges offering this program.`,
    }
  } catch {
    return {
      title: 'Course Details - EntranceGateway',
      description: 'View detailed information about courses and programs.',
    }
  }
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params
  
  // Validate ID - show 404 if invalid
  if (!id || id === 'undefined' || id === 'null') {
    notFound()
  }

  // Fetch initial data on server with proper error handling
  let initialData = null
  
  try {
    initialData = await getCourseById(id)
  } catch (error) {
    console.error('Failed to fetch course details:', error)
    // Don't throw - let client component handle the error
  }

  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading course..." />}>
      <CourseDetailContent courseId={id} initialData={initialData} />
    </Suspense>
  )
}
