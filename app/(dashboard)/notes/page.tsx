import { Suspense } from 'react'
import { NotesPageContent } from '@/components/features/notes/NotesPageContent'
import { CardGridSkeleton } from '@/components/shared/Loading'
import { getNotes } from '@/services/server/notes.server'

export const metadata = {
  title: 'Academic Notes Directory - EntranceGateway',
  description: 'Browse comprehensive study materials, lecture notes, and summaries curated for university students across Nepal.',
}

export default async function NotesPage() {
  // Fetch initial data on server
  const initialData = await getNotes({ page: 0, size: 9 }).catch(() => null)

  return (
    <Suspense fallback={<CardGridSkeleton count={9} />}>
      <NotesPageContent initialData={initialData} />
    </Suspense>
  )
}
