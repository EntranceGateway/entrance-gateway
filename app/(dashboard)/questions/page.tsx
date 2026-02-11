import { Suspense } from 'react'
import { QuestionsPageContent } from '@/components/features/questions/QuestionsPageContent'
import { getOldQuestions } from '@/services/server/questions.server'
import { CenteredSpinner } from '@/components/shared/Loading'

export const metadata = {
  title: 'Old Questions Archive Directory - EntranceGateway',
  description: 'Access and download past entrance exam question papers for major IT courses in Nepal.',
}

export default async function QuestionsPage() {
  // Fetch initial data on server with proper error handling
  let initialData = null
  let error = null

  try {
    const response = await getOldQuestions({ 
      page: 0, 
      size: 10, 
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
      />
    </Suspense>
  )
}
