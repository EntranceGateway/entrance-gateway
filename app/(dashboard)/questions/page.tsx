import { Suspense } from 'react'
import { QuestionsPageContent } from '@/components/features/questions/QuestionsPageContent'
import { getOldQuestions } from '@/services/server/questions.server'
import { CenteredSpinner } from '@/components/shared/Loading'

export const metadata = {
  title: 'Old Questions Archive Directory - EntranceGateway',
  description: 'Access and download past entrance exam question papers for major IT courses in Nepal.',
}

interface QuestionsPageProps {
  searchParams?: Promise<{
    page?: string
    size?: string
  }>
}

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 50

export default async function QuestionsPage({ searchParams }: QuestionsPageProps) {
  const params = await searchParams
  const page = Math.max(0, Number(params?.page ?? '1') - 1 || 0)
  const size = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(params?.size ?? String(DEFAULT_PAGE_SIZE)) || DEFAULT_PAGE_SIZE)
  )

  let initialData = null
  let error = null

  try {
    const response = await getOldQuestions({ 
      page,
      size,
      sortBy: 'year', 
      sortDir: 'desc' 
    })
    initialData = response.data
  } catch (err) {
    console.error('Failed to fetch initial questions data:', err)
    error = err instanceof Error ? err.message : 'Failed to load questions'
  }

  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading questions..." />}>
      <QuestionsPageContent 
        initialData={initialData?.content || null} 
        initialError={error}
        initialTotalPages={initialData?.totalPages || 0}
        initialPage={page}
      />
    </Suspense>
  )
}
