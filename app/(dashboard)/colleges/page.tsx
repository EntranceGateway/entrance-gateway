import { Suspense } from 'react'
import { CollegesPageContent } from '@/components/features/colleges/CollegesPageContent'
import { getColleges } from '@/services/server/colleges.server'
import { CenteredSpinner } from '@/components/shared/Loading'

export const metadata = {
  title: 'Featured Institutes | EntranceGateway',
  description: 'Explore top colleges and universities in Nepal offering quality education in engineering, IT, management, and more.',
}

export default async function CollegesPage() {
  // Fetch initial data on server with proper error handling
  let initialData = null
  let error = null

  try {
    const response = await getColleges({ 
      page: 0, 
      size: 10, 
      sortBy: 'collegeName', 
      sortDir: 'asc' 
    })
    initialData = response.data
  } catch (err) {
    console.error('Failed to fetch initial colleges data:', err)
    error = err instanceof Error ? err.message : 'Failed to load colleges'
  }

  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading colleges..." />}>
      <CollegesPageContent 
        initialData={initialData?.content || null} 
        initialError={error}
        initialTotalPages={initialData?.totalPages || 0}
      />
    </Suspense>
  )
}
