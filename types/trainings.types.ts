// Trainings API Types - Matching backend response structure

export interface Training {
  trainingId: number
  slug: string
  trainingName: string
  description: string
  syllabusDescription: string
  startDate: string // ISO date string
  endDate: string // ISO date string
  trainingType: 'REMOTE' | 'IN_PERSON' | 'HYBRID'
  trainingStatus: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'
  trainingHours: number
  location: string
  maxParticipants: number
  currentParticipants: number
  trainingCategory: string
  price: number
  certificateProvided: boolean
  materialsLink: string | null
  remarks: string | null
}

export interface TrainingsListResponse {
  message: string
  data: {
    content: Training[]
    totalElements: number
    totalPages: number
    pageNumber: number
    pageSize: number
    last: boolean
  }
}

export interface TrainingDetailResponse {
  message: string
  data: Training
}

export interface TrainingsQueryParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  trainingCategory?: string
  trainingType?: string
  trainingStatus?: string
}

// Error response type
export interface ApiErrorResponse {
  message: string
  data: null
}

// Training Enrollment Types
export interface TrainingEnrollment {
  enrollmentId: number
  userId: number
  userName: string
  trainingId: number
  trainingName: string
  status: 'PENDING' | 'PAYMENT_PENDING' | 'PAYMENT_RECEIVED_ADMIN_APPROVAL_PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PAYMENT_FAILED' | 'EXPIRED' | 'SUSPENDED'
  enrollmentDate: string
  completionDate: string | null
  paidAmount: number
  paymentReference: string | null
  paymentMethod: string | null
  progressPercentage: number
  remarks: string | null
  createdAt: string
  updatedAt: string
}

export interface TrainingEnrollmentResponse {
  message: string
  data: TrainingEnrollment | null
}

export interface TrainingEnrollmentsListResponse {
  message: string
  data: TrainingEnrollment[]
}

// Payment Response Types
export interface PaymentResponse {
  message: string
  data: {
    paymentId: number
    amount: number
    paymentMethod: string
    paymentDate: string
    status?: string
  }
}
