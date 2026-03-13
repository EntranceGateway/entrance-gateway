'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function CartPaymentSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/my-enrollments')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <main className="flex-grow bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12 sm:w-14 sm:h-14 text-green-600"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy mb-3 font-heading">
            Payment Submitted Successfully!
          </h1>
          <p className="text-gray-600 mb-8 text-sm sm:text-base">
            Your payment proof has been submitted and is pending admin verification.
          </p>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-start gap-3">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-brand-blue flex-shrink-0 mt-0.5"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-bold text-brand-navy mb-2">What happens next?</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>Our team will verify your payment within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>You'll receive a confirmation email once approved</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>Your quizzes will be available in "My Enrollments"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-blue mt-1">•</span>
                    <span>Check your profile for enrollment status updates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/my-enrollments')}
              className="bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              View My Enrollments
            </button>
            <button
              onClick={() => router.push('/quiz')}
              className="bg-white hover:bg-gray-50 text-brand-navy font-bold py-3 px-8 rounded-lg transition-colors border-2 border-gray-200"
            >
              Browse More Quizzes
            </button>
          </div>

          {/* Auto-redirect Notice */}
          <p className="mt-8 text-xs text-gray-500">
            You will be redirected to My Enrollments in 5 seconds...
          </p>
        </div>
      </div>
    </main>
  )
}
