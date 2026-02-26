import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { CollegeDetailContent } from '@/components/features/colleges/CollegeDetailContent'
import { CenteredSpinner } from '@/components/shared/Loading'
import { getCollegeById } from '@/services/server/colleges.server'
import type { Metadata } from 'next'

interface CollegeDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CollegeDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  
  if (!slug || slug === 'undefined') {
    return {
      title: 'College Not Found | EntranceGateway',
      description: 'The requested college could not be found.',
    }
  }

  try {
    const response = await getCollegeById(slug)
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
  const { slug } = await params
  
  if (!slug || slug === 'undefined' || slug === 'null') {
    notFound()
  }

  let initialData = null
  
  try {
    initialData = await getCollegeById(slug)
  } catch (error) {
    console.error('Failed to fetch college details:', error)
  }

  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading college..." />}>
      <CollegeDetailContent collegeSlug={slug} initialData={initialData} />
    </Suspense>
  )
}

