import { QuizPaymentSuccess } from '@/components/features/quiz/QuizPaymentSuccess'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Submitted | EntranceGateway',
  description: 'Your payment has been submitted successfully',
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function PaymentSuccessPage({ params }: PageProps) {
  return <QuizPaymentSuccess slug={params.slug} />
}
