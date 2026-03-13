import { QuizPaymentSuccess } from '@/components/features/quiz/QuizPaymentSuccess'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Submitted | EntranceGateway',
  description: 'Your payment has been submitted successfully',
}

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PaymentSuccessPage({ params }: PageProps) {
  const { slug } = await params
  return <QuizPaymentSuccess slug={slug} />
}
