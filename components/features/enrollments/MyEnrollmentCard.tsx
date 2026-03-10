'use client'

import { useRouter } from 'next/navigation'
import type { QuizPurchase } from '@/types/enrollment.types'

interface MyEnrollmentCardProps {
  purchase: QuizPurchase
}

export function MyEnrollmentCard({ purchase }: MyEnrollmentCardProps) {
  const router = useRouter()

  const getStatusBadge = () => {
    switch (purchase.purchaseStatus) {
      case 'PAID':
      case 'ACTIVE':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full tracking-wider uppercase">
            PAID
          </span>
        )
      case 'APPROVAL_PENDING':
      case 'PENDING':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full tracking-wider uppercase">
            APPROVAL PENDING
          </span>
        )
      case 'FAILED':
      case 'PAYMENT_FAILED':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full tracking-wider uppercase">
            FAILED
          </span>
        )
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full tracking-wider uppercase">
            {purchase.purchaseStatus}
          </span>
        )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const handleAction = () => {
    if (purchase.purchaseStatus === 'PAID' || purchase.purchaseStatus === 'ACTIVE') {
      router.push(`/quiz/${purchase.quizSlug}/start`)
    } else {
      router.push(`/quiz/${purchase.quizSlug}`)
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Quiz Image */}
      <div className="md:w-64 bg-gray-100 relative min-h-[160px]">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy to-brand-blue opacity-80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-6xl opacity-50">quiz</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-2 gap-2">
            {getStatusBadge()}
            <span className="text-xs font-medium text-gray-500">ID: #{purchase.purchaseId}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-3 sm:mb-4 leading-tight font-heading">
            {purchase.quizName}
          </h3>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-blue text-sm">school</span>
              <div className="text-xs">
                <p className="text-gray-400">Course</p>
                <p className="font-semibold text-gray-900">{purchase.courseName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-blue text-sm">quiz</span>
              <div className="text-xs">
                <p className="text-gray-400">Questions</p>
                <p className="font-semibold text-gray-900">{purchase.nosOfQuestions} Qs</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-blue text-sm">schedule</span>
              <div className="text-xs">
                <p className="text-gray-400">Duration</p>
                <p className="font-semibold text-gray-900">{purchase.durationInMinutes} Min</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-blue text-sm">calendar_today</span>
              <div className="text-xs">
                <p className="text-gray-400">Date</p>
                <p className="font-semibold text-gray-900">{formatDate(purchase.purchaseDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-3">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-tight">
              {purchase.purchaseStatus === 'PAID' || purchase.purchaseStatus === 'ACTIVE' ? 'Amount Paid' : 'Total Amount'}
            </p>
            <p className="text-lg font-bold text-brand-navy">{formatPrice(purchase.amountPaid)}</p>
          </div>

          {(purchase.purchaseStatus === 'PAID' || purchase.purchaseStatus === 'ACTIVE') && (
            <button
              onClick={handleAction}
              className="w-full sm:w-auto bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span>Start Test</span>
              <span className="material-symbols-outlined">play_circle</span>
            </button>
          )}

          {(purchase.purchaseStatus === 'APPROVAL_PENDING' || purchase.purchaseStatus === 'PENDING') && (
            <button
              onClick={handleAction}
              className="w-full sm:w-auto border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span>View Details</span>
              <span className="material-symbols-outlined text-sm">info</span>
            </button>
          )}

          {(purchase.purchaseStatus === 'FAILED' || purchase.purchaseStatus === 'PAYMENT_FAILED') && (
            <button
              onClick={() => router.push(`/quiz/${purchase.quizSlug}/payment`)}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span>Retry Payment</span>
              <span className="material-symbols-outlined">refresh</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
