import { QuizPageContent } from '@/components/features/quiz'
import { getQuizzes } from '@/services/server/quiz.server'
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
  
  return <QuizPageContent initialData={initialData} />
}
