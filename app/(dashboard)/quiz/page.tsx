import { QuizPageContent } from '@/components/features/quiz'
import { getQuizzes } from '@/services/server/quiz.server'
import { checkMultipleQuizPurchaseStatuses } from '@/services/server/payment.server'
import { logger } from '@/lib/logger'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Available Quizzes | EntranceGateway',
  description: 'Prepare for your entrance exams with our professionally curated quizzes designed to simulate real exam conditions and boost your cognitive agility.',
}

export default async function QuizPage() {
  const initialData = await getQuizzes({ 
    page: 0, 
    size: 12,
    sortBy: 'setName',
    sortDir: 'asc',
  }).catch(() => null)
  
  // Fetch purchase statuses for all quizzes in parallel
  let purchaseStatuses: Record<number, string> = {}
  
  if (initialData?.data?.content && Array.isArray(initialData.data.content)) {
    try {
      const quizIds = initialData.data.content.map(quiz => quiz.questionSetId)
      const statusMap = await checkMultipleQuizPurchaseStatuses(quizIds)
      
      // Convert Map to plain object for serialization
      purchaseStatuses = Object.fromEntries(
        Array.from(statusMap.entries()).map(([id, response]) => [
          id,
          response?.data?.status ?? 'NOT_PURCHASED'
        ])
      )
    } catch (error) {
      // Silent error - purchase statuses will default to NOT_PURCHASED
      logger.error('[QuizPage] Error fetching purchase statuses:', error instanceof Error ? error.message : 'Unknown error')
    }
  }
  
  return <QuizPageContent initialData={initialData} purchaseStatuses={purchaseStatuses} />
}
