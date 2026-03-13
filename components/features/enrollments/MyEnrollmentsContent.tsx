'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MyEnrollmentCard } from './MyEnrollmentCard'
import { EnrollmentCard } from './EnrollmentCard'
import { EnrollmentCardSkeletonGrid } from './EnrollmentCardSkeleton'
import { fetchMyQuizPurchases, fetchMyTrainingEnrollments } from '@/services/client/enrollment.client'
import type { QuizPurchase } from '@/types/enrollment.types'
import type { TrainingEnrollment } from '@/types/trainings.types'

type FilterTab = 'all' | 'quizzes' | 'trainings'

export function MyEnrollmentsContent() {
  const router = useRouter()
  const [quizPurchases, setQuizPurchases] = useState<QuizPurchase[]>([])
  const [trainingEnrollments, setTrainingEnrollments] = useState<TrainingEnrollment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const loadEnrollments = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [quizResponse, trainingResponse] = await Promise.all([
        fetchMyQuizPurchases(),
        fetchMyTrainingEnrollments(),
      ])
      
      setQuizPurchases(quizResponse.data || [])
      setTrainingEnrollments(trainingResponse.data || [])
    } catch (err) {
      setError('Unable to load your enrollments. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEnrollments()
  }, [loadEnrollments])

  const totalCount = quizPurchases.length + trainingEnrollments.length

  return (
    <main className="flex-grow bg-gray-50">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy font-heading">
              My Enrollments
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage and access your purchased quizzes and training enrollments.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-200 mb-6 sm:mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 sm:px-6 py-3 border-b-2 font-bold text-sm whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'border-brand-gold text-brand-navy'
                : 'border-transparent text-gray-500 hover:text-brand-navy'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-4 sm:px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'quizzes'
                ? 'border-brand-gold text-brand-navy'
                : 'border-transparent text-gray-500 hover:text-brand-navy'
            }`}
          >
            Quizzes ({quizPurchases.length})
          </button>
          <button
            onClick={() => setActiveTab('trainings')}
            className={`px-4 sm:px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'trainings'
                ? 'border-brand-gold text-brand-navy'
                : 'border-transparent text-gray-500 hover:text-brand-navy'
            }`}
          >
            Trainings ({trainingEnrollments.length})
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <EnrollmentCardSkeletonGrid count={3} />
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && totalCount === 0 && (
          <div className="text-center py-12">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-16 mx-auto text-gray-300 mb-4"
            >
              <path
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Not Implemented Yet
            </h3>
            <p className="text-gray-500 mb-6">
              This feature is currently under development. Check back soon!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push('/quiz')}
                className="bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Browse Quizzes
              </button>
              <button
                onClick={() => router.push('/trainings')}
                className="bg-brand-blue hover:bg-brand-navy text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Browse Trainings
              </button>
            </div>
          </div>
        )}

        {/* Enrollments Grid */}
        {!isLoading && !error && totalCount > 0 && (
          <div className="grid gap-6">
            {/* Show Quizzes */}
            {(activeTab === 'all' || activeTab === 'quizzes') && quizPurchases.map((purchase) => (
              <MyEnrollmentCard key={`quiz-${purchase.purchaseId}`} purchase={purchase} />
            ))}
            
            {/* Show Trainings */}
            {(activeTab === 'all' || activeTab === 'trainings') && trainingEnrollments.map((enrollment) => (
              <EnrollmentCard key={`training-${enrollment.enrollmentId}`} enrollment={enrollment} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
