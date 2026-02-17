'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrainingsDetailHero } from './TrainingsDetailHero'
import { TrainingsDetailSidebar } from './TrainingsDetailSidebar'
import { EnrollmentDetailsModal } from './EnrollmentDetailsModal'
import { CenteredSpinner } from '@/components/shared/Loading'
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer'
import { fetchTrainingById, checkEnrollmentStatus } from '@/services/client/trainings.client'
import { isAuthenticated } from '@/lib/auth/client'
import type { Training, TrainingDetailResponse, TrainingEnrollmentResponse } from '@/types/trainings.types'

interface TrainingsDetailContentProps {
  trainingId: string
  initialData?: TrainingDetailResponse | null
}

export function TrainingsDetailContent({ trainingId, initialData }: TrainingsDetailContentProps) {
  const [training, setTraining] = useState<Training | null>(initialData?.data || null)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const [enrollmentStatus, setEnrollmentStatus] = useState<TrainingEnrollmentResponse | null>(null)
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true)
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false)

  // Fetch training data and enrollment status
  useEffect(() => {
    const loadData = async () => {
      // Load training if not from SSR
      if (!initialData) {
        setIsLoading(true)
        setError(null)

        try {
          const response = await fetchTrainingById(trainingId)
          setTraining(response.data)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load training')
          console.error('Error fetching training:', err)
        } finally {
          setIsLoading(false)
        }
      }

      // Check enrollment status ONLY if user is authenticated
      setIsCheckingEnrollment(true)
      try {
        // Check if user is logged in before making API call
        if (!isAuthenticated()) {
          setEnrollmentStatus(null)
          setIsCheckingEnrollment(false)
          return
        }

        const status = await checkEnrollmentStatus(parseInt(trainingId))
        setEnrollmentStatus(status)
      } catch (err) {
        setEnrollmentStatus(null)
      } finally {
        setIsCheckingEnrollment(false)
      }
    }

    loadData()
  }, [trainingId, initialData])

  const handleDownloadMaterials = () => {
    if (training?.materialsLink) {
      window.open(training.materialsLink, '_blank')
    }
  }

  // Loading State
  if (isLoading) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <CenteredSpinner size="lg" text="Loading training details..." />
        </div>
      </main>
    )
  }

  // Error State
  if (error || !training) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-semantic-error/10 border border-semantic-error text-semantic-error p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <div>
                <h3 className="font-bold text-lg mb-1">Failed to load training</h3>
                <p className="text-sm">{error || 'Training not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Parse syllabus description - no longer needed as we use markdown
  // Get enrollment status details - be defensive about null/undefined
  const isEnrolled = !!(enrollmentStatus?.data && enrollmentStatus.data !== null)
  const enrollmentData = enrollmentStatus?.data
  const isPending = !!(enrollmentData && enrollmentData.status === 'PAYMENT_PENDING')
  const isConfirmed = !!(enrollmentData && (enrollmentData.status === 'COMPLETED' || enrollmentData.status === 'ACTIVE'))
  const isPaymentReceived = !!(enrollmentData && enrollmentData.status === 'PAYMENT_RECEIVED_ADMIN_APPROVAL_PENDING')
  const isExpired = !!(enrollmentData && enrollmentData.status === 'EXPIRED')
  const isCancelled = !!(enrollmentData && enrollmentData.status === 'CANCELLED')

  // User can view enrollment details if enrolled
  const canViewEnrollment = isEnrolled

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <TrainingsDetailHero training={training} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Enrollment Status Banner */}
        {!isCheckingEnrollment && isEnrolled && (
          <div className="mb-6">
            {/* Payment Received - Awaiting Admin Approval */}
            {isPaymentReceived && (
              <div className="bg-blue-50 border-l-4 border-brand-blue rounded-r-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="size-8 rounded-full bg-brand-blue flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-white">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wide mb-1">
                      ✓ Payment Received
                    </h3>
                    <p className="text-sm text-gray-700">
                      Your payment has been received and is pending admin approval. You'll receive a confirmation email once approved.
                    </p>
                    {enrollmentData?.enrollmentDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Payment received on: {new Date(enrollmentData.enrollmentDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Confirmed Enrollment */}
            {isConfirmed && (
              <div className="bg-semantic-success/10 border-l-4 border-semantic-success rounded-r-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="size-8 rounded-full bg-semantic-success flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-white">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-semantic-success uppercase tracking-wide mb-1">
                      ✓ Enrollment Confirmed
                    </h3>
                    <p className="text-sm text-gray-700">
                      You are successfully enrolled in this training. Check your email for confirmation details.
                    </p>
                    {enrollmentData?.enrollmentDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Enrolled on: {new Date(enrollmentData.enrollmentDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Pending Payment */}
            {isPending && (
              <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="size-8 rounded-full bg-amber-500 flex items-center justify-center animate-pulse">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-white">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide mb-1">
                      ⏳ Payment Pending
                    </h3>
                    <p className="text-sm text-amber-900">
                      Your enrollment is pending payment. Complete payment within 24 hours to confirm your spot.
                    </p>
                    {enrollmentData?.createdAt && (
                      <p className="text-xs text-amber-800 mt-1 font-medium">
                        Expires: {new Date(new Date(enrollmentData.createdAt).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                    <Link
                      href={`/trainings/${trainingId}/enroll`}
                      className="mt-3 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      Complete Payment
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Expired Enrollment */}
            {isExpired && (
              <div className="bg-red-50 border-l-4 border-red-600 rounded-r-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="size-8 rounded-full bg-red-600 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-white">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-red-900 uppercase tracking-wide mb-1">
                      ⚠️ Enrollment Expired
                    </h3>
                    <p className="text-sm text-red-900">
                      Your previous enrollment has expired due to non-payment. You can enroll again if seats are available.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Cancelled Enrollment */}
            {isCancelled && (
              <div className="bg-gray-50 border-l-4 border-gray-400 rounded-r-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="size-8 rounded-full bg-gray-400 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-white">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Enrollment Cancelled
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your enrollment has been cancelled. Contact support if you have any questions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enrollment Details Section - Show if user is enrolled */}
        {!isCheckingEnrollment && canViewEnrollment && enrollmentData && (
          <div className="mb-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 sm:justify-between">
                <div className="flex items-start gap-3 flex-1 w-full sm:w-auto">
                  <div className="size-10 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-blue">
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-brand-navy mb-1 text-sm sm:text-base">
                      Your Enrollment
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500">Status:</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${
                          isPaymentReceived ? 'bg-blue-100 text-brand-blue' :
                          isConfirmed ? 'bg-green-100 text-semantic-success' :
                          isPending ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {enrollmentData.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 flex-shrink-0">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <span>Progress: {enrollmentData.progressPercentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEnrollmentModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2 bg-brand-navy hover:bg-brand-blue text-white font-bold rounded-lg transition-colors text-sm whitespace-nowrap"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* About Section */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-brand-navy mb-3 sm:mb-4 font-heading">
                About this Training
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {training.description}
              </p>
            </section>

            {/* Course Syllabus - Scrollable Card */}
            {training.syllabusDescription && (
              <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 sm:p-6 md:p-8 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 sm:size-6 text-brand-blue shrink-0">
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                    </svg>
                    <h2 className="text-xl sm:text-2xl font-bold text-brand-navy font-heading">
                      Course Syllabus
                    </h2>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto p-5 sm:p-6 md:p-8 bg-gray-50">
                  <MarkdownRenderer content={training.syllabusDescription} />
                </div>
              </section>
            )}

            {/* Learning Highlights */}
            <section className="bg-gradient-to-br from-brand-blue/5 to-brand-gold/5 border border-brand-blue/10 rounded-xl p-5 sm:p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 sm:size-6 text-brand-blue shrink-0">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-navy font-heading">
                  Learning Highlights
                </h2>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Engage in interactive workshops, real-world case studies, and hands-on simulation sessions designed to enhance your practical skills and knowledge.
              </p>
            </section>

            {/* Download Materials Button */}
            {training.materialsLink && (
              <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 md:p-8">
                <button
                  onClick={handleDownloadMaterials}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-[#FFB300] text-brand-navy font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base shadow-sm"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                  </svg>
                  Download Course Materials
                </button>
              </section>
            )}

            {/* Who Should Attend Section */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-brand-navy mb-3 sm:mb-4 font-heading">
                Who Should Attend?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                This training is ideal for professionals looking to enhance their skills in {training.trainingCategory.toLowerCase()}. 
                Whether you're a beginner or have some experience, this program will help you advance your career.
              </p>
            </section>

            {/* Remarks Section */}
            {training.remarks && (
              <section className="bg-blue-50 border border-blue-100 rounded-xl p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-blue shrink-0 mt-0.5">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-brand-navy mb-1 text-sm sm:text-base">Additional Information</h3>
                    <p className="text-xs sm:text-sm text-gray-700">{training.remarks}</p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div>
            <TrainingsDetailSidebar 
              training={training} 
              enrollmentStatus={enrollmentStatus}
              isCheckingEnrollment={isCheckingEnrollment}
              onViewEnrollment={() => setIsEnrollmentModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Enrollment Details Modal */}
      {isEnrollmentModalOpen && enrollmentData && (
        <EnrollmentDetailsModal
          enrollmentData={enrollmentData}
          onClose={() => setIsEnrollmentModalOpen(false)}
        />
      )}
    </main>
  )
}
