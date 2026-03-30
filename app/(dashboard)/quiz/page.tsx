import { QuizPageContent } from '@/components/features/quiz'
import { getQuizzes } from '@/services/server/quiz.server'
import { checkMultipleQuizPurchaseStatuses } from '@/services/server/payment.server'
import { logger } from '@/lib/logger'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Available Quizzes | EntranceGateway',
  description: 'Prepare for your entrance exams with our professionally curated quizzes designed to simulate real exam conditions and boost your cognitive agility.',
}

interface QuizPageProps {
  searchParams?: Promise<{
    page?: string
    size?: string
  }>
}

const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 50

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const params = await searchParams
  const page = Math.max(0, Number(params?.page ?? '1') - 1 || 0)
  const size = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(params?.size ?? String(DEFAULT_PAGE_SIZE)) || DEFAULT_PAGE_SIZE)
  )

  const initialData = await getQuizzes({ 
    page,
    size,
    sortBy: 'setName',
    sortDir: 'asc',
  }).catch(() => null)
  
  let purchaseStatuses: Record<number, string> = {}
  
  if (initialData?.data?.content && Array.isArray(initialData.data.content)) {
    try {
      const quizIds = initialData.data.content.map(quiz => quiz.questionSetId)
      const statusMap = await checkMultipleQuizPurchaseStatuses(quizIds)
      
      purchaseStatuses = Object.fromEntries(
        Array.from(statusMap.entries()).map(([id, response]) => [
          id,
          response?.data?.status ?? 'NOT_PURCHASED'
        ])
      )
    } catch (error) {
      logger.error('[QuizPage] Error fetching purchase statuses:', error instanceof Error ? error.message : 'Unknown error')
    }
  }
  
  return <QuizPageContent initialData={initialData} purchaseStatuses={purchaseStatuses} initialPage={page} />
}
