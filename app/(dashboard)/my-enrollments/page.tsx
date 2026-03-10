import { MyEnrollmentsContent } from '@/components/features/enrollments/MyEnrollmentsContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Quiz Purchases | EntranceGateway',
  description: 'Manage and access your purchased mock tests and exam materials',
}

export default function MyEnrollmentsPage() {
  return <MyEnrollmentsContent />
}
