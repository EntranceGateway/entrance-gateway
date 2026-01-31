import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { SyllabusDetailContent } from '@/components/features/syllabus/SyllabusDetailContent'
import { getSyllabusById } from '@/services/server/syllabus.server'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  
  // Validate ID
  if (!id || id === 'undefined') {
    return {
      title: 'Syllabus Not Found | EntranceGateway',
      description: 'The requested syllabus could not be found.',
    }
  }

  const response = await getSyllabusById(id).catch(() => null)

  return {
    title: response?.data.syllabusTitle 
      ? `${response.data.syllabusTitle} - Syllabus | EntranceGateway`
      : 'Syllabus Detail | EntranceGateway',
    description: response?.data.syllabusTitle 
      ? `View and download ${response.data.syllabusTitle} syllabus for ${response.data.courseName} - ${response.data.semester} Semester`
      : 'View and download course syllabus with detailed information.',
  }
}

export default async function SyllabusDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Validate ID - show 404 if invalid
  if (!id || id === 'undefined' || id === 'null') {
    notFound()
  }

  // Fetch syllabus data on server
  const initialData = await getSyllabusById(id).catch(() => null)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SyllabusDetailContent syllabusId={id} initialData={initialData} />
    </Suspense>
  )
}
