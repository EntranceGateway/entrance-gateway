import { Suspense } from 'react'
import { NotesPageContent } from '@/components/features/notes/NotesPageContent'
import { CardGridSkeleton } from '@/components/shared/Loading'
import { getNotes } from '@/services/server/notes.server'

export const metadata = {
  title: 'Academic Notes Directory - EntranceGateway',
  description: 'Browse comprehensive study materials, lecture notes, and summaries curated for university students across Nepal.',
}

interface NotesPageProps {
  searchParams?: Promise<{
    page?: string
    size?: string
  }>
}

const DEFAULT_PAGE_SIZE = 9
const MAX_PAGE_SIZE = 50

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const params = await searchParams
  const page = Math.max(0, Number(params?.page ?? '1') - 1 || 0)
  const size = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(params?.size ?? String(DEFAULT_PAGE_SIZE)) || DEFAULT_PAGE_SIZE)
  )

  const initialData = await getNotes({ page, size }).catch(() => null)

  return (
    <Suspense fallback={<CardGridSkeleton count={size} />}>
      <NotesPageContent initialData={initialData} initialPage={page} pageSize={size} />
    </Suspense>
  )
}
