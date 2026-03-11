import { useState } from 'react'
import { EnrollmentDetailsModal } from '@/components/features/trainings/EnrollmentDetailsModal'
import type { TrainingEnrollment } from '@/types/trainings.types'

interface EnrollmentCardProps {
  enrollment: TrainingEnrollment
}

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  PAYMENT_PENDING: {
    label: 'Payment Pending',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  PAYMENT_RECEIVED_ADMIN_APPROVAL_PENDING: {
    label: 'Approval Pending',
    className: 'bg-blue-50 text-brand-blue border-blue-200',
  },
  ACTIVE: {
    label: 'Active',
    className: 'bg-green-50 text-semantic-success border-green-200',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-green-50 text-semantic-success border-green-200',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
  PAYMENT_FAILED: {
    label: 'Payment Failed',
    className: 'bg-red-50 text-semantic-error border-red-200',
  },
  EXPIRED: {
    label: 'Expired',
    className: 'bg-red-50 text-semantic-error border-red-200',
  },
  SUSPENDED: {
    label: 'Suspended',
    className: 'bg-yellow-50 text-semantic-warning border-yellow-200',
  },
}

export function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!enrollment) return null

  const statusConfig = STATUS_CONFIG[enrollment.status] || STATUS_CONFIG.PENDING

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-3 sm:p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 md:gap-6">
          {/* Main Content */}
          <div className="flex-grow space-y-3 sm:space-y-4">
            {/* Title and Status */}
            <div className="flex flex-col xs:flex-row xs:flex-wrap xs:items-center gap-2 xs:gap-3">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-brand-navy font-heading break-words">
                {enrollment.trainingName}
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
                  Paid: <span className="font-medium text-gray-900">{enrollment.paidAmount === 0 ? 'Free' : `NPR ${enrollment.paidAmount.toLocaleString()}`}</span>
                </span>
              </div>

              {/* Payment Method */}
              {enrollment.paymentMethod && (
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 sm:size-5 text-gray-400 mr-1.5 sm:mr-2 shrink-0"
                  >
                    <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM18 13h-2v3h-3v2h3v3h2v-3h3v-2h-3z" />
                  </svg>
                  <span className="break-words">
                    via <span className="font-medium text-gray-900">{enrollment.paymentMethod}</span>
                  </span>
                </div>
              )}

              {/* Enrollment Date */}
              <div className="flex items-center text-xs sm:text-sm text-gray-600 sm:col-span-2 lg:col-span-1">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4 sm:size-5 text-gray-400 mr-1.5 sm:mr-2 shrink-0"
                >
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
                <span className="break-words">
                  Date: <span className="font-medium text-gray-900">{formatDate(enrollment.enrollmentDate)}</span>
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex justify-between text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span>Course Progress</span>
                <span>{enrollment.progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                <div
                  className="bg-brand-blue h-1.5 sm:h-2 rounded-full transition-all duration-300"
                  style={{ width: `${enrollment.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex lg:min-w-[140px] xl:min-w-[160px]">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg border-2 border-brand-blue text-brand-blue font-semibold text-xs sm:text-sm hover:bg-brand-blue hover:text-white transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Enrollment Details Modal */}
      {isModalOpen && (
        <EnrollmentDetailsModal
          enrollmentData={enrollment}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}
