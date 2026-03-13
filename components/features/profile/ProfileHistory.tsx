'use client'

import { useState, useRef } from 'react'
import { ProfileTabs, type ProfileTab } from './ProfileTabs'
import { EnrollmentsTab } from './tabs/EnrollmentsTab'
import { QuizAttemptsTab } from './tabs/QuizAttemptsTab'
import { PurchasesTab } from './tabs/PurchasesTab'
import { AdmissionsTab } from './tabs/AdmissionsTab'
import { fetchUserHistory } from '@/services/client/history.client'
import type { UserProfileFull, PaginatedResponse } from '@/types/user.types'
import { CenteredSpinner } from '@/components/shared/Loading'

interface ProfileHistoryProps {
  initialData: UserProfileFull
}

export function ProfileHistory({ initialData }: ProfileHistoryProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('enrollments')
  const [profileData, setProfileData] = useState<UserProfileFull>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  
  // Track ongoing request to prevent race conditions
  const abortControllerRef = useRef<AbortController | null>(null)

  // Page states for each tab
  const [enrollmentsPage, setEnrollmentsPage] = useState(0)
  const [quizAttemptsPage, setQuizAttemptsPage] = useState(0)
  const [purchasesPage, setPurchasesPage] = useState(0)
  const [admissionsPage, setAdmissionsPage] = useState(0)

  // Helper function to get safe paginated data
  const getSafeEnrollmentsData = (): PaginatedResponse<any> => {
    if (profileData?.enrollmentsPaginated) {
      return profileData.enrollmentsPaginated
    }
    return {
      content: [],
      totalElements: profileData?.totalEnrollments || 0,
      totalPages: 1,
      currentPage: 0,
      pageSize: 0,
      hasNext: false,
      hasPrevious: false,
    }
  }

  const getSafeQuizAttemptsData = (): PaginatedResponse<any> => {
    if (profileData?.quizAttemptsPaginated) {
      return profileData.quizAttemptsPaginated
    }
    return {
      content: [],
      totalElements: profileData?.totalQuizAttempts || 0,
      totalPages: 1,
      currentPage: 0,
      pageSize: 0,
      hasNext: false,
      hasPrevious: false,
    }
  }

  const getSafePurchasesData = (): PaginatedResponse<any> => {
    if (profileData?.purchasesPaginated) {
      return profileData.purchasesPaginated
    }
    return {
      content: [],
      totalElements: profileData?.totalPurchases || 0,
      totalPages: 1,
      currentPage: 0,
      pageSize: 0,
      hasNext: false,
      hasPrevious: false,
    }
  }

  const getSafeAdmissionsData = (): PaginatedResponse<any> => {
    if (profileData?.admissionsPaginated) {
      return profileData.admissionsPaginated
    }
    return {
      content: [],
      totalElements: profileData?.totalAdmissions || 0,
      totalPages: 1,
      currentPage: 0,
      pageSize: 0,
      hasNext: false,
      hasPrevious: false,
    }
  }

  const loadData = async (params: {
    enrollmentsPage?: number
    quizAttemptsPage?: number
    purchasesPage?: number
    admissionsPage?: number
  }) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Create new abort controller for this request
    const currentController = new AbortController()
    abortControllerRef.current = currentController
    
    setIsLoading(true)
    try {
      const response = await fetchUserHistory({
        enrollmentsPage: params.enrollmentsPage ?? enrollmentsPage,
        enrollmentsSize: 20,
        quizAttemptsPage: params.quizAttemptsPage ?? quizAttemptsPage,
        quizAttemptsSize: 20,
        purchasesPage: params.purchasesPage ?? purchasesPage,
        purchasesSize: 20,
        admissionsPage: params.admissionsPage ?? admissionsPage,
        admissionsSize: 20,
      })
      
      if (response?.data) {
        // Convert history data to UserProfileFull format
        const updatedData: UserProfileFull = {
          ...profileData,
          totalEnrollments: response.data.totalEnrollments || 0,
          totalQuizAttempts: response.data.totalQuizAttempts || 0,
          totalPurchases: response.data.totalPurchases || 0,
          totalAdmissions: response.data.totalAdmissions || 0,
          isPaginated: response.data.isPaginated || false,
          enrollmentsPaginated: response.data.enrollmentsPaginated || {
            content: response.data.enrollments || [],
            totalElements: response.data.totalEnrollments || 0,
            totalPages: 1,
            currentPage: 0,
            pageSize: response.data.enrollments?.length || 0,
            hasNext: false,
            hasPrevious: false,
          },
          quizAttemptsPaginated: response.data.quizAttemptsPaginated || {
            content: response.data.quizAttempts || [],
            totalElements: response.data.totalQuizAttempts || 0,
            totalPages: 1,
            currentPage: 0,
            pageSize: response.data.quizAttempts?.length || 0,
            hasNext: false,
            hasPrevious: false,
          },
          purchasesPaginated: response.data.purchasesPaginated || {
            content: response.data.purchases || [],
            totalElements: response.data.totalPurchases || 0,
            totalPages: 1,
            currentPage: 0,
            pageSize: response.data.purchases?.length || 0,
            hasNext: false,
            hasPrevious: false,
          },
          admissionsPaginated: response.data.admissionsPaginated || {
            content: response.data.admissions || [],
            totalElements: response.data.totalAdmissions || 0,
            totalPages: 1,
            currentPage: 0,
            pageSize: response.data.admissions?.length || 0,
            hasNext: false,
            hasPrevious: false,
          },
        }
        setProfileData(updatedData)
      }
    } catch (error) {
      // Ignore aborted requests
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }
      // Silent error - keep existing data
      console.error('[ProfileHistory] Failed to load data:', error instanceof Error ? error.message : 'Unknown error')
    } finally {
      // Only clear loading state if this is still the active request
      if (abortControllerRef.current === currentController) {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    }
  }

  const handleEnrollmentsPageChange = (page: number) => {
    setEnrollmentsPage(page)
    loadData({ enrollmentsPage: page })
  }

  const handleQuizAttemptsPageChange = (page: number) => {
    setQuizAttemptsPage(page)
    loadData({ quizAttemptsPage: page })
  }

  const handlePurchasesPageChange = (page: number) => {
    setPurchasesPage(page)
    loadData({ purchasesPage: page })
  }

  const handleAdmissionsPageChange = (page: number) => {
    setAdmissionsPage(page)
    loadData({ admissionsPage: page })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          enrollments: profileData?.totalEnrollments || 0,
          quizAttempts: profileData?.totalQuizAttempts || 0,
          purchases: profileData?.totalPurchases || 0,
          admissions: profileData?.totalAdmissions || 0,
        }}
      />

      {isLoading ? (
        <div className="p-12">
          <CenteredSpinner size="lg" text="Loading..." />
        </div>
      ) : (
        <div className="p-0">
          {activeTab === 'enrollments' && (
            <EnrollmentsTab
              data={getSafeEnrollmentsData()}
              onPageChange={handleEnrollmentsPageChange}
            />
          )}
          {activeTab === 'quizAttempts' && (
            <QuizAttemptsTab
              data={getSafeQuizAttemptsData()}
              onPageChange={handleQuizAttemptsPageChange}
            />
          )}
          {activeTab === 'purchases' && (
            <PurchasesTab
              data={getSafePurchasesData()}
              onPageChange={handlePurchasesPageChange}
            />
          )}
          {activeTab === 'admissions' && (
            <AdmissionsTab
              data={getSafeAdmissionsData()}
              onPageChange={handleAdmissionsPageChange}
            />
          )}
        </div>
      )}
    </div>
  )
}
