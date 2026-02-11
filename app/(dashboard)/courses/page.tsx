import { Suspense } from 'react'
import { CoursesPageContent } from '@/components/features/courses/CoursesPageContent'
import { getCourses } from '@/services/server/courses.server'
import { CenteredSpinner } from '@/components/shared/Loading'

export const metadata = {
  title: 'Courses | EntranceGateway',
  description: 'Explore various courses offered by colleges and universities in Nepal including CSIT, BCA, and more.',
}

export default async function CoursesPage() {
  // Fetch initial data on server with proper error handling
  let initialData = null
  let error = null

  try {
    const response = await getCourses({ 
      page: 0, 
      size: 10, 
      sortBy: 'courseName', 
      sortDir: 'asc' 
    })
    initialData = response.data
  } catch (err) {
    console.error('Failed to fetch initial courses data:', err)
    error = err instanceof Error ? err.message : 'Failed to load courses'
  }

  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading courses..." />}>
      <CoursesPageContent 
        initialData={initialData?.content || null} 
        initialError={error}
        initialTotalPages={initialData?.totalPages || 0}
      />
    </Suspense>
  )
}

