'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TrainingsDetailHero } from './TrainingsDetailHero'
import { TrainingsDetailSidebar } from './TrainingsDetailSidebar'
import { CenteredSpinner } from '@/components/shared/Loading'
import { fetchTrainingById, checkEnrollmentStatus } from '@/services/client/trainings.client'
import type { Training, TrainingDetailResponse, TrainingEnrollmentResponse } from '@/types/trainings.types'

interface TrainingsDetailContentProps {
  trainingId: string
  initialData?: TrainingDetailResponse | null
}

export function TrainingsDetailContent({ trainingId, initialData }: TrainingsDetailContentProps) {
  const router = useRouter()
  const [training, setTraining] = useState<Training | null>(initialData?.data || null)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const [enrollmentStatus, setEnrollmentStatus] = useState<TrainingEnrollmentResponse | null>(null)
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true)

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

      // Check enrollment status
      setIsCheckingEnrollment(true)
      try {
        const status = await checkEnrollmentStatus(parseInt(trainingId))
        setEnrollmentStatus(status)
        console.log('Enrollment status:', status)
      } catch (err) {
        console.error('Error checking enrollment status:', err)
      } finally {
        setIsCheckingEnrollment(false)
      }
    }

    loadData()
  }, [trainingId, initialData])

  const handleRegister = () => {
    // Redirect to enrollment page
    router.push(`/trainings/${trainingId}/enroll`)
  }

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

  // Parse syllabus description into bullet points
  const syllabusPoints = training.syllabusDescription
    ? training.syllabusDescription.split(/[,;]/).map(point => point.trim()).filter(Boolean)
    : []

  // Get enrollment status details
  const isEnrolled = enrollmentStatus?.data !== null
  const enrollmentData = enrollmentStatus?.data
  const isPending = enrollmentData?.status === 'PAYMENT_PENDING'
  const isConfirmed = enrollmentData?.status === 'CONFIRMED' || enrollmentData?.status === 'COMPLETED'
  const isExpired = enrollmentData?.status === 'EXPIRED'
  const isCancelled = enrollmentData?.status === 'CANCELLED'

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <TrainingsDetailHero training={training} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Enrollment Status Banner */}
        {!isCheckingEnrollment && isEnrolled && (
          <div className="mb-6">
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
                    <button
                      onClick={() => router.push(`/trainings/${trainingId}/enroll`)}
                      className="mt-3 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      Complete Payment
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                      </svg>
                    </button>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4 font-heading">
                About this Training
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {training.description}
              </p>

              {/* Syllabus and Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Course Syllabus */}
                {syllabusPoints.length > 0 && (
                  <div className="p-5 border border-gray-100 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-blue">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                      </svg>
                      <h3 className="font-bold text-gray-900">Course Syllabus</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {syllabusPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-brand-blue font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Learning Highlights */}
                <div className="p-5 border border-brand-blue/10 bg-brand-blue/5 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-blue">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <h3 className="font-bold text-gray-900">Learning Highlights</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Engage in interactive workshops, real-world case studies, and hands-on simulation sessions.
                  </p>
                </div>
              </div>

              {/* Download Materials Button */}
              {training.materialsLink && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleDownloadMaterials}
                    className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-navy font-medium text-sm transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                    </svg>
                    Download Course Materials
                  </button>
                </div>
              )}
            </section>

            {/* Who Should Attend Section */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4 font-heading">
                Who Should Attend?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                This training is ideal for professionals looking to enhance their skills in {training.trainingCategory.toLowerCase()}. 
                Whether you're a beginner or have some experience, this program will help you advance your career.
              </p>
            </section>

            {/* Remarks Section */}
            {training.remarks && (
              <section className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-blue shrink-0 mt-0.5">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-brand-navy mb-1">Additional Information</h3>
                    <p className="text-sm text-gray-700">{training.remarks}</p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div>
            <TrainingsDetailSidebar 
              training={training} 
              onRegister={handleRegister}
              enrollmentStatus={enrollmentStatus}
              isCheckingEnrollment={isCheckingEnrollment}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
