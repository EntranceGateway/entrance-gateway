import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { CollegeDetailContent } from '@/components/features/colleges/CollegeDetailContent'
import { CenteredSpinner } from '@/components/shared/Loading'
import { getCollegeById } from '@/services/server/colleges.server'
import type { Metadata } from 'next'

interface CollegeDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CollegeDetailPageProps): Promise<Metadata> {
  const { id } = await params
  
  // Validate ID
  if (!id || id === 'undefined') {
    return {
      title: 'College Not Found | EntranceGateway',
      description: 'The requested college could not be found.',
    }
  }

  try {
    const response = await getCollegeById(id)
    const college = response.data

    return {
      title: `${college.collegeName} - ${college.location} | EntranceGateway`,
      description: college.description || `Explore ${college.collegeName} offering quality education in ${college.location}`,
    }
  } catch {
    return {
      title: 'College Details - EntranceGateway',
      description: 'View detailed information about colleges and universities.',
    }
  }
}

export default async function CollegeDetailPage({ params }: CollegeDetailPageProps) {
  const { id } = await params
  
  // Validate ID - show 404 if invalid
  if (!id || id === 'undefined' || id === 'null') {
    notFound()
  }

  // Fetch initial data on server with proper error handling
  let initialData = null
  
  try {
    initialData = await getCollegeById(id)
  } catch (error) {
    console.error('Failed to fetch college details:', error)
    // Don't throw - let client component handle the error
  }

  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading college..." />}>
      <CollegeDetailContent collegeId={id} initialData={initialData} />
    </Suspense>
  )
}

