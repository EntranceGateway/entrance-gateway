// Trainings API Types - Matching backend response structure

export interface Training {
  trainingId: number
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
