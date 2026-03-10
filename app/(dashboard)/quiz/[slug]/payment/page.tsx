import { QuizPaymentPage } from '@/components/features/quiz/QuizPaymentPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quiz Payment | EntranceGateway',
  description: 'Complete your payment to access the quiz',
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function PaymentPage({ params }: PageProps) {
  return <QuizPaymentPage slug={params.slug} />
}
