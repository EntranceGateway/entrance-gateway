import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { CourseDetailContent } from '@/components/features/courses/CourseDetailContent'
import { CenteredSpinner } from '@/components/shared/Loading'
import { getCourseById } from '@/services/server/courses.server'
import type { Metadata } from 'next'

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  
  if (!slug || slug === 'undefined') {
    return {
      title: 'Course Not Found | EntranceGateway',
      description: 'The requested course could not be found.',
    }
  }

  try {
    const response = await getCourseById(slug)
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
  const { slug } = await params
  
  if (!slug || slug === 'undefined' || slug === 'null') {
    notFound()
  }

  let initialData = null
  
  try {
    initialData = await getCourseById(slug)
  } catch (error) {
    console.error('Failed to fetch course details:', error)
  }

  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading course..." />}>
      <CourseDetailContent courseSlug={slug} initialData={initialData} />
    </Suspense>
  )
}
