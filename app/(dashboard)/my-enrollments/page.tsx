import { MyEnrollmentsContent } from '@/components/features/enrollments/MyEnrollmentsContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Enrollments | EntranceGateway',
  description: 'Manage and access your purchased quizzes and training enrollments',
}

export default function MyEnrollmentsPage() {
  return <MyEnrollmentsContent />
}
