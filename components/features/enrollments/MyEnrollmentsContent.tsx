'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MyEnrollmentCard } from './MyEnrollmentCard'
import { CenteredSpinner } from '@/components/shared/Loading'
import { fetchMyQuizPurchases } from '@/services/client/enrollment.client'
import type { QuizPurchase } from '@/types/enrollment.types'

type FilterTab = 'all' | 'paid' | 'pending'

export function MyEnrollmentsContent() {
  const router = useRouter()
  const [purchases, setPurchases] = useState<QuizPurchase[]>([])
  const [filteredPurchases, setFilteredPurchases] = useState<QuizPurchase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  useEffect(() => {
    loadPurchases()
  }, [])

  useEffect(() => {
    filterPurchases()
  }, [activeTab, purchases])

  const loadPurchases = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchMyQuizPurchases()
      setPurchases(response.data)
    } catch (err) {
      console.error('Failed to load purchases:', err)
      setError('Unable to load your purchases. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const filterPurchases = () => {
    if (activeTab === 'all') {
      setFilteredPurchases(purchases)
    } else if (activeTab === 'paid') {
      setFilteredPurchases(purchases.filter(p => p.purchaseStatus === 'PAID' || p.purchaseStatus === 'ACTIVE'))
    } else if (activeTab === 'pending') {
      setFilteredPurchases(purchases.filter(p => p.purchaseStatus === 'APPROVAL_PENDING' || p.purchaseStatus === 'PENDING'))
    }
  }

  return (
    <main className="flex-grow bg-gray-50">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <button onClick={() => router.push('/')} className="hover:text-brand-blue">
                Dashboard
              </button>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-brand-blue font-medium">My Quiz Purchases</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy font-heading">
              My Quiz Purchases
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage and access your purchased mock tests and exam materials.
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
            All Purchases
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`px-4 sm:px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'paid'
                ? 'border-brand-gold text-brand-navy'
                : 'border-transparent text-gray-500 hover:text-brand-navy'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 sm:px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'pending'
                ? 'border-brand-gold text-brand-navy'
                : 'border-transparent text-gray-500 hover:text-brand-navy'
            }`}
          >
            Pending Approval
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-12">
            <CenteredSpinner size="lg" text="Loading your purchases..." />
          </div>
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
        {!isLoading && !error && filteredPurchases.length === 0 && (
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
              {activeTab === 'all' && 'No purchases yet'}
              {activeTab === 'paid' && 'No completed purchases'}
              {activeTab === 'pending' && 'No pending purchases'}
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'all' && 'Start by purchasing a quiz to begin your preparation.'}
              {activeTab === 'paid' && 'Your completed purchases will appear here.'}
              {activeTab === 'pending' && 'Purchases awaiting approval will appear here.'}
            </p>
            <button
              onClick={() => router.push('/quiz')}
              className="bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Browse Quizzes
            </button>
          </div>
        )}

        {/* Purchases Grid */}
        {!isLoading && !error && filteredPurchases.length > 0 && (
          <div className="grid gap-6">
            {filteredPurchases.map((purchase) => (
              <MyEnrollmentCard key={purchase.purchaseId} purchase={purchase} />
            ))}
          </div>
        )}

        {/* Help Section */}
        {!isLoading && (
          <div className="mt-12 bg-brand-blue/5 rounded-xl p-6 sm:p-8 border border-brand-blue/10">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-brand-blue text-3xl shrink-0">
                help_outline
              </span>
              <div>
                <h4 className="text-lg font-bold text-brand-navy">Need help with your purchase?</h4>
                <p className="text-gray-600 mt-2 mb-4 text-sm sm:text-base">
                  If your transaction is pending for more than 24 hours, or you're experiencing issues 
                  accessing your content, please reach out to our support team.
                </p>
                <a
                  href="mailto:support@entrancegateway.com"
                  className="text-brand-blue font-bold hover:underline inline-flex items-center gap-1"
                >
                  Contact Student Support
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
