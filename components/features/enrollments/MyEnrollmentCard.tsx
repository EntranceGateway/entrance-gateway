'use client'

import { useRouter } from 'next/navigation'
import type { QuizPurchase } from '@/types/enrollment.types'

interface MyEnrollmentCardProps {
  purchase: QuizPurchase
}

const STATUS_CONFIG = {
  PAID: {
    label: 'Paid',
    className: 'bg-green-50 text-semantic-success border-green-200',
  },
  ACTIVE: {
    label: 'Active',
    className: 'bg-green-50 text-semantic-success border-green-200',
  },
  APPROVAL_PENDING: {
    label: 'Approval Pending',
    className: 'bg-blue-50 text-brand-blue border-blue-200',
  },
  PENDING: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  FAILED: {
    label: 'Failed',
    className: 'bg-red-50 text-semantic-error border-red-200',
  },
  PAYMENT_FAILED: {
    label: 'Payment Failed',
    className: 'bg-red-50 text-semantic-error border-red-200',
  },
}

export function MyEnrollmentCard({ purchase }: MyEnrollmentCardProps) {
  const router = useRouter()

  const statusConfig = STATUS_CONFIG[purchase.purchaseStatus as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleAction = () => {
    if (purchase.purchaseStatus === 'PAID' || purchase.purchaseStatus === 'ACTIVE') {
      router.push(`/quiz/${purchase.quizSlug}/start`)
    } else if (purchase.purchaseStatus === 'FAILED' || purchase.purchaseStatus === 'PAYMENT_FAILED') {
      router.push(`/quiz/${purchase.quizSlug}/payment`)
    } else {
      router.push(`/quiz/${purchase.quizSlug}`)
    }
  }

  const getActionButton = () => {
    if (purchase.purchaseStatus === 'PAID' || purchase.purchaseStatus === 'ACTIVE') {
      return {
        label: 'Start Quiz',
        className: 'w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg bg-brand-gold hover:bg-yellow-400 text-brand-navy font-semibold text-xs sm:text-sm transition-colors'
      }
    } else if (purchase.purchaseStatus === 'FAILED' || purchase.purchaseStatus === 'PAYMENT_FAILED') {
      return {
        label: 'Retry Payment',
        className: 'w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm transition-colors'
      }
    }
    return null
  }

  const actionButton = getActionButton()

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 md:gap-6">
        {/* Main Content */}
        <div className="flex-grow space-y-3 sm:space-y-4">
          {/* Title and Status */}
          <div className="flex flex-col xs:flex-row xs:flex-wrap xs:items-center gap-2 xs:gap-3">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-brand-navy font-heading break-words">
              {purchase.quizName}
            </h2>
            <span
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase border ${statusConfig.className} w-fit`}
            >
              {statusConfig.label}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 sm:gap-y-3 gap-x-3 sm:gap-x-4 md:gap-x-8">
            {/* Payment Amount */}
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 sm:size-5 text-gray-400 mr-1.5 sm:mr-2 shrink-0"
              >
                <path d="M11 17h2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-1h4V8h-2V7h-2v1h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v1H9v2h2v1zm9-13H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V6h16v12z" />
              </svg>
              <span className="break-words">
                Paid: <span className="font-medium text-gray-900">NPR {purchase.amountPaid.toLocaleString()}</span>
              </span>
            </div>

            {/* Course */}
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 sm:size-5 text-gray-400 mr-1.5 sm:mr-2 shrink-0"
              >
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
              </svg>
              <span className="break-words">
                Course: <span className="font-medium text-gray-900">{purchase.courseName}</span>
              </span>
            </div>

            {/* Questions */}
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 sm:size-5 text-gray-400 mr-1.5 sm:mr-2 shrink-0"
              >
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
              </svg>
              <span className="break-words">
                Questions: <span className="font-medium text-gray-900">{purchase.nosOfQuestions}</span>
              </span>
            </div>

            {/* Duration */}
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 sm:size-5 text-gray-400 mr-1.5 sm:mr-2 shrink-0"
              >
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              <span className="break-words">
                Duration: <span className="font-medium text-gray-900">{purchase.durationInMinutes} Min</span>
              </span>
            </div>

            {/* Purchase Date */}
            <div className="flex items-center text-xs sm:text-sm text-gray-600 sm:col-span-2 lg:col-span-1">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 sm:size-5 text-gray-400 mr-1.5 sm:mr-2 shrink-0"
              >
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
              </svg>
              <span className="break-words">
                Date: <span className="font-medium text-gray-900">{formatDate(purchase.purchaseDate)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {actionButton && (
          <div className="flex lg:min-w-[140px] xl:min-w-[160px]">
            <button
              onClick={handleAction}
              className={actionButton.className}
            >
              {actionButton.label}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
