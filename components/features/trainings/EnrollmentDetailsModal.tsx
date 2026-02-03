'use client'

import type { TrainingEnrollmentResponse } from '@/types/trainings.types'

interface EnrollmentDetailsModalProps {
  enrollmentData: TrainingEnrollmentResponse['data']
  onClose: () => void
}

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
      </svg>
    ),
  },
  PAYMENT_PENDING: {
    label: 'Payment Pending',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
      </svg>
    ),
  },
  PAYMENT_RECEIVED_ADMIN_APPROVAL_PENDING: {
    label: 'Payment Received - Pending Approval',
    color: 'text-brand-blue',
    bgColor: 'bg-blue-100',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    ),
  },
  ACTIVE: {
    label: 'Active',
    color: 'text-semantic-success',
    bgColor: 'bg-green-100',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    ),
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'text-semantic-success',
    bgColor: 'bg-green-100',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    ),
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-semantic-success',
    bgColor: 'bg-green-100',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    ),
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
      </svg>
    ),
  },
  PAYMENT_FAILED: {
    label: 'Payment Failed',
    color: 'text-semantic-error',
    bgColor: 'bg-red-100',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
  },
  EXPIRED: {
    label: 'Expired',
    color: 'text-semantic-error',
    bgColor: 'bg-red-100',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
  },
  SUSPENDED: {
    label: 'Suspended',
    color: 'text-semantic-warning',
    bgColor: 'bg-yellow-100',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
  },
}

export function EnrollmentDetailsModal({ enrollmentData, onClose }: EnrollmentDetailsModalProps) {
  if (!enrollmentData) return null

  const statusConfig = STATUS_CONFIG[enrollmentData.status] || STATUS_CONFIG.PENDING

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <div className="flex-1 min-w-0 pr-3">
            <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading truncate">
              Enrollment Details
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">{enrollmentData.trainingName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 sm:size-6">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-center py-2">
            <div className={`inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full ${statusConfig.bgColor}`}>
              <div className={statusConfig.color}>
                <div className="size-5 sm:size-6">{statusConfig.icon}</div>
              </div>
              <span className={`font-bold text-base sm:text-lg ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Enrollment Information */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-5 space-y-3 sm:space-y-4">
            <h3 className="font-bold text-brand-navy text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              Enrollment Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Student Name</p>
                <p className="text-sm font-semibold text-gray-900 break-words">{enrollmentData.userName}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Enrollment Date</p>
                <p className="text-sm font-semibold text-gray-900">{formatDate(enrollmentData.enrollmentDate)}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Progress</p>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-2.5">
                    <div
                      className="bg-brand-blue h-2 sm:h-2.5 rounded-full transition-all"
                      style={{ width: `${enrollmentData.progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-brand-navy min-w-[2.5rem] sm:min-w-[3rem] text-right">{enrollmentData.progressPercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-5 space-y-3 sm:space-y-4">
            <h3 className="font-bold text-brand-navy text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
              Payment Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Amount Paid</p>
                <p className="text-sm font-semibold text-gray-900">NPR {enrollmentData.paidAmount.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Payment Method</p>
                <p className="text-sm font-semibold text-gray-900 break-words">
                  {enrollmentData.paymentMethod || 'N/A'}
                </p>
              </div>

              {enrollmentData.paymentReference && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Payment Reference</p>
                  <p className="text-xs sm:text-sm font-mono font-semibold text-gray-900 bg-white px-2 sm:px-3 py-2 rounded border border-gray-200 break-all">
                    {enrollmentData.paymentReference}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-5 space-y-3 sm:space-y-4">
            <h3 className="font-bold text-brand-navy text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
              Additional Details
            </h3>

            <div className="space-y-3">
              {enrollmentData.completionDate && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Completion Date</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(enrollmentData.completionDate)}</p>
                </div>
              )}

              {enrollmentData.remarks && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Remarks</p>
                  <p className="text-xs sm:text-sm text-gray-700 bg-white px-2 sm:px-3 py-2 rounded border border-gray-200 break-words">
                    {enrollmentData.remarks}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Created At</p>
                  <p className="text-xs text-gray-600 break-words">{formatDate(enrollmentData.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
                  <p className="text-xs text-gray-600 break-words">{formatDate(enrollmentData.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <button
            onClick={onClose}
            className="w-full bg-brand-navy hover:bg-brand-blue text-white font-bold py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
