import { Suspense } from 'react'
import { CoursesPageContent } from '@/components/features/courses/CoursesPageContent'
import { getCourses } from '@/services/server/courses.server'
import { CenteredSpinner } from '@/components/shared/Loading'

export const metadata = {
  title: 'Courses | EntranceGateway',
  description: 'Explore various courses offered by colleges and universities in Nepal including CSIT, BCA, and more.',
}

interface CoursesPageProps {
  searchParams?: Promise<{
    page?: string
    size?: string
  }>
}

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 50

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams
  const page = Math.max(0, Number(params?.page ?? '1') - 1 || 0)
  const size = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(params?.size ?? String(DEFAULT_PAGE_SIZE)) || DEFAULT_PAGE_SIZE)
  )

  let initialData = null
  let error = null

  try {
    const response = await getCourses({ 
      page,
      size,
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
        initialPage={page}
      />
    </Suspense>
  )
}
