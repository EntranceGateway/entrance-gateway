'use client'

import { useRouter } from 'next/navigation'

interface QuizPaymentSuccessProps {
  slug: string
}

export function QuizPaymentSuccess({ slug }: QuizPaymentSuccessProps) {
  const router = useRouter()

  return (
    <main className="flex-grow bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 md:w-12 md:h-12 text-green-600">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-brand-navy mb-4">
            Payment Submitted Successfully!
          </h1>
          <p className="text-gray-600 mb-8">
            Your payment has been submitted for review. Our admin team will verify your payment within 24 hours. 
            You will receive a confirmation email once approved.
          </p>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-brand-blue shrink-0">info</span>
              <div>
                <p className="text-sm font-bold text-brand-navy mb-2">What happens next?</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Admin will review your payment proof</li>
                  <li>• You'll receive an email notification</li>
                  <li>• Once approved, you can start the quiz</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/quiz')}
              className="px-6 py-3 bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold rounded-lg transition-colors"
            >
              Browse More Quizzes
            </button>
            <button
              onClick={() => router.push('/my-enrollments')}
              className="px-6 py-3 bg-white hover:bg-gray-50 text-brand-navy font-bold rounded-lg border-2 border-brand-navy transition-colors"
            >
              View My Enrollments
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
