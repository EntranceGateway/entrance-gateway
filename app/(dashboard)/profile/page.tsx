import { ProfilePageContentNew } from '@/components/features/profile'
import { getUserHistory } from '@/services/server/history.server'
import { getUserProfile } from '@/services/server/user.server'
import { redirect } from 'next/navigation'
import type { UserProfileFull } from '@/types/user.types'

export const metadata = {
  title: 'Profile - EntranceGateway',
  description: 'Manage your profile and view your activity history',
}

export default async function ProfilePage() {
  const historyData = await getUserHistory({
    enrollmentsPage: 0,
    enrollmentsSize: 20,
    quizAttemptsPage: 0,
    quizAttemptsSize: 20,
    purchasesPage: 0,
    purchasesSize: 20,
    admissionsPage: 0,
    admissionsSize: 20,
  })

  if (!historyData) {
    let basicProfile
    
    try {
      basicProfile = await getUserProfile()
      
      if (!basicProfile?.data) {
        redirect('/signin?redirect=/profile')
      }
    } catch (error) {
      redirect('/signin?redirect=/profile')
    }

    const fullProfileData: UserProfileFull = {
      ...basicProfile!.data,
      totalEnrollments: 0,
      totalQuizAttempts: 0,
      totalPurchases: 0,
      totalAdmissions: 0,
      isPaginated: true,
      enrollmentsPaginated: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 20,
        hasNext: false,
        hasPrevious: false,
      },
      quizAttemptsPaginated: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 20,
        hasNext: false,
        hasPrevious: false,
      },
      purchasesPaginated: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 20,
        hasNext: false,
        hasPrevious: false,
      },
      admissionsPaginated: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 20,
        hasNext: false,
        hasPrevious: false,
      },
    }

    return (
      <main className="flex-grow bg-gray-50">
        <ProfilePageContentNew initialData={fullProfileData} />
      </main>
    )
  }

  const createPaginatedFromArray = <T,>(array: T[] | undefined, total: number) => {
    const content = array || []
    const pageSize = content.length
    return {
      content,
      totalElements: total,
      totalPages: pageSize > 0 ? Math.ceil(total / pageSize) : 0,
      currentPage: 0,
      pageSize,
      hasNext: false,
      hasPrevious: false,
    }
  }

  const fullProfileData: UserProfileFull = {
    userId: historyData.data.userId,
    fullname: historyData.data.fullname,
    email: historyData.data.email || '',
    contact: historyData.data.contact || '',
    address: historyData.data.address || '',
    dob: historyData.data.dob || '',
    interested: historyData.data.interested || '',
    latestQualification: historyData.data.latestQualification || '',
    isVerified: historyData.data.isVerified || false,
    role: historyData.data.role || 'USER',
    totalEnrollments: historyData.data.totalEnrollments || 0,
    totalQuizAttempts: historyData.data.totalQuizAttempts || 0,
    totalPurchases: historyData.data.totalPurchases || 0,
    totalAdmissions: historyData.data.totalAdmissions || 0,
    isPaginated: historyData.data.isPaginated || false,
    enrollmentsPaginated: historyData.data.enrollmentsPaginated ?? 
      createPaginatedFromArray(historyData.data.enrollments, historyData.data.totalEnrollments || 0),
    quizAttemptsPaginated: historyData.data.quizAttemptsPaginated ?? 
      createPaginatedFromArray(historyData.data.quizAttempts, historyData.data.totalQuizAttempts || 0),
    purchasesPaginated: historyData.data.purchasesPaginated ?? 
      createPaginatedFromArray(historyData.data.purchases, historyData.data.totalPurchases || 0),
    admissionsPaginated: historyData.data.admissionsPaginated ?? 
      createPaginatedFromArray(historyData.data.admissions, historyData.data.totalAdmissions || 0),
  }

  return (
    <main className="flex-grow bg-gray-50">
      <ProfilePageContentNew initialData={fullProfileData} />
    </main>
  )
}
