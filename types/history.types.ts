// History API Types - Paginated user activity history

// Pagination Types
export interface PaginationInfo {
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface PaginatedResponse<T> extends PaginationInfo {
  content: T[]
}

// Training Enrollment History
export interface TrainingEnrollmentHistory {
  enrollmentId: number
  userId: number
  userName: string
  trainingId: number
  trainingName: string
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  enrollmentDate: string
  completionDate?: string
  paidAmount: number
  paymentReference: string
  paymentMethod: string
  progressPercentage: number
  remarks?: string
  createdAt: string
  updatedAt: string
  paymentProofName?: string
}

// Quiz Attempt History
export interface QuizAttemptHistory {
  attemptId: number
  quizId: number
  quizName: string
  questionSetId: number
  questionSetName: string
  questionText: string
  attemptDate: string // ISO date string
  score: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  isCorrect: boolean
  status: 'COMPLETED' | 'IN_PROGRESS' | 'ABANDONED'
}

// Purchase History
export interface PurchaseHistory {
  purchaseId: number
  quizId?: number
  quizName?: string
  setId?: number
  setName?: string
  trainingId?: number
  trainingName?: string
  purchaseDate: string // ISO date string
  amount: number
  paymentMethod: string
  transactionId: string
  purchaseStatus: 'COMPLETED' | 'PENDING' | 'FAILED' | 'PAID'
}

// Admission History
export interface AdmissionHistory {
  admissionId: number
  collegeId: number
  collegeName: string
  courseName: string
  applicationDate: string // ISO date string
  approvalDate?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLISTED'
  remarks?: string
}

// User History Data (includes basic user info + history)
export interface UserHistoryData {
  userId: number
  fullname: string
  email?: string
  contact?: string
  address?: string
  dob?: string
  interested?: string
  latestQualification?: string
  isVerified?: boolean
  role?: 'USER' | 'ADMIN'
  totalEnrollments: number
  totalQuizAttempts: number
  totalPurchases: number
  totalAdmissions: number
  isPaginated: boolean
  // Non-paginated arrays (when isPaginated: false)
  enrollments?: TrainingEnrollmentHistory[]
  quizAttempts?: QuizAttemptHistory[]
  purchases?: PurchaseHistory[]
  admissions?: AdmissionHistory[]
  // Paginated responses (when isPaginated: true)
  enrollmentsPaginated?: PaginatedResponse<TrainingEnrollmentHistory> | null
  quizAttemptsPaginated?: PaginatedResponse<QuizAttemptHistory> | null
  purchasesPaginated?: PaginatedResponse<PurchaseHistory> | null
  admissionsPaginated?: PaginatedResponse<AdmissionHistory> | null
}

export interface UserHistoryResponse {
  message: string
  data: UserHistoryData
}

// Query Parameters for Paginated History
export interface HistoryQueryParams {
  enrollmentsPage?: number
  enrollmentsSize?: number
  quizAttemptsPage?: number
  quizAttemptsSize?: number
  purchasesPage?: number
  purchasesSize?: number
  admissionsPage?: number
  admissionsSize?: number
}
