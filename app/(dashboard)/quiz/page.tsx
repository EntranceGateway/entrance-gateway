import { QuizPageContent } from '@/components/features/quiz'
import { getQuizzes } from '@/services/server/quiz.server'
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

  return <QuizPageContent initialData={initialData} purchaseStatuses={{}} initialPage={page} />
}
