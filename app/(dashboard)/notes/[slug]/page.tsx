import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { NotesDetailContent } from '@/components/features/notes/NotesDetailContent'
import { CenteredSpinner } from '@/components/shared/Loading'
import { getNoteById } from '@/services/server/notes.server'
import type { Metadata } from 'next'

interface NotesDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: NotesDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  
  // Validate slug
  if (!slug || slug === 'undefined') {
    return {
      title: 'Note Not Found | EntranceGateway',
      description: 'The requested note could not be found.',
    }
  }

  try {
    const response = await getNoteById(slug)
    const note = response.data

    return {
      title: `${note.noteName} - ${note.subject} - EntranceGateway`,
      description: note.noteDescription || `View ${note.noteName} for ${note.courseName} - ${note.subject}`,
    }
  } catch {
    return {
      title: 'Note Details - EntranceGateway',
      description: 'View and download academic notes.',
    }
  }
}

export default async function NotesDetailPage({ params }: NotesDetailPageProps) {
  const { slug } = await params
  
  // Validate slug - show 404 if invalid
  if (!slug || slug === 'undefined' || slug === 'null') {
    notFound()
  }

  // Fetch initial data on server
  const initialData = await getNoteById(slug).catch(() => null)

  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading note..." />}>
      <NotesDetailContent noteSlug={slug} initialData={initialData} />
    </Suspense>
  )
}
