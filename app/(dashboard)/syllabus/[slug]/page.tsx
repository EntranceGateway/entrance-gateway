import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { SyllabusDetailContent } from '@/components/features/syllabus/SyllabusDetailContent'
import { getSyllabusById } from '@/services/server/syllabus.server'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  
  // Validate slug (can be actual slug or syllabusId)
  if (!slug || slug === 'undefined') {
    return {
      title: 'Syllabus Not Found | EntranceGateway',
      description: 'The requested syllabus could not be found.',
    }
  }

  // API accepts both slug and id
  const response = await getSyllabusById(slug).catch(() => null)

  return {
    title: response?.data.syllabusTitle 
      ? `${response.data.syllabusTitle} - Syllabus | EntranceGateway`
      : 'Syllabus Detail | EntranceGateway',
    description: response?.data.syllabusTitle 
      ? `View and download ${response.data.syllabusTitle} syllabus for ${response.data.courseName} - ${response.data.semester} Semester`
      : 'View and download course syllabus with detailed information.',
  }
}

export default async function SyllabusDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Validate slug (can be actual slug or syllabusId)
  if (!slug || slug === 'undefined' || slug === 'null') {
    notFound()
  }

  // Fetch syllabus data on server - API accepts both slug and id
  const initialData = await getSyllabusById(slug).catch(() => null)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SyllabusDetailContent syllabusSlug={slug} initialData={initialData} />
    </Suspense>
  )
}
