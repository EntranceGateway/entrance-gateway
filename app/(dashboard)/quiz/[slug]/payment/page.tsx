import { QuizPaymentPage } from '@/components/features/quiz/QuizPaymentPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quiz Payment | EntranceGateway',
  description: 'Complete your payment to access the quiz',
}

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PaymentPage({ params }: PageProps) {
  const { slug } = await params
  return <QuizPaymentPage slug={slug} />
}
