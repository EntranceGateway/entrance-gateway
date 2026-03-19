// Client-side Trainings API calls (for CSR)
// Uses Next.js API routes as proxy to backend

import type {
  TrainingsListResponse,
  TrainingDetailResponse,
  TrainingsQueryParams,
  TrainingEnrollmentResponse,
} from '@/types/trainings.types'
import { generateUUID } from '@/lib/utils/uuid'
import { logger } from '@/lib/logger'

/**
 * Enroll in a free training
 * Uses Next.js API proxy route: POST /api/trainings/[id]/enroll-free
 * Backend endpoint: POST /api/v1/training-enrollments/{trainingId}/enroll-free
 */
export async function enrollInFreeTraining(trainingId: number): Promise<TrainingEnrollmentResponse> {
  // Validate trainingId
  if (typeof trainingId !== 'number' || isNaN(trainingId) || trainingId <= 0) {
    logger.error('[enrollInFreeTraining] Invalid training ID:', trainingId)
    throw new Error('Invalid training ID')
  }

  const idempotencyKey = generateUUID()

  try {
    const response = await fetch(`/api/trainings/${trainingId}/enroll-free`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
    })

    const data = await response.json().catch(() => ({ message: 'Invalid response format' }))

    if (!response.ok) {
      logger.error('[enrollInFreeTraining] API error:', response.status, data)
      
      // User-friendly error messages based on status code
      if (response.status === 401) {
        throw new Error('Please sign in to enroll in this training')
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to enroll')
      }
      if (response.status === 404) {
        throw new Error('Training not found')
      }
      if (response.status === 409) {
        throw new Error('You are already enrolled in this training')
      }
      if (response.status === 422) {
        throw new Error('Training has reached maximum capacity')
      }
      
      throw new Error(data.message || 'Failed to enroll in training')
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    logger.error('[enrollInFreeTraining] Unexpected error:', error)
    throw new Error('Network error. Please check your connection and try again')
  }
}

/**
 * Fetch paginated list of trainings (Client-side via proxy)
 * Used in Client Components with useState/useEffect or React Query
 */
export async function fetchTrainings(
  params: TrainingsQueryParams = {}
): Promise<TrainingsListResponse> {
  const {
    page = 0,
    size = 10,
    sortBy = 'trainingStatus',
    sortDir = 'asc',
    ...filters
  } = params

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir,
  })

  // Add filter params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString())
    }
  })

  try {
    const response = await fetch(`/api/trainings?${queryParams}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      logger.error('[fetchTrainings] API error:', response.status, response.statusText)
      throw new Error('Failed to load trainings')
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    logger.error('[fetchTrainings] Unexpected error:', error)
    throw new Error('Network error. Please check your connection')
  }
}

/**
 * Fetch single training by ID (Client-side via proxy)
 * Used in Client Components
 */
export async function fetchTrainingById(id: string): Promise<TrainingDetailResponse> {
  try {
    const response = await fetch(`/api/trainings/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      logger.error('[fetchTrainingById] API error:', response.status, response.statusText)
      
      if (response.status === 404) {
        throw new Error('Training not found')
      }
      
      throw new Error('Failed to load training details')
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    logger.error('[fetchTrainingById] Unexpected error:', error)
    throw new Error('Network error. Please check your connection')
  }
}

/**
 * Check if user has an existing enrollment for a training
 * Returns enrollment status if exists, null if not enrolled or not authenticated
 */
export async function checkEnrollmentStatus(trainingId: number): Promise<TrainingEnrollmentResponse | null> {
  // Validate trainingId
  if (typeof trainingId !== 'number' || isNaN(trainingId) || trainingId <= 0) {
    logger.error('[checkEnrollmentStatus] Invalid trainingId:', trainingId)
    return {
      message: 'Invalid training ID',
      data: null
    }
  }

  try {
    const response = await fetch(`/api/trainings/${trainingId}/enrollment-status`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    // Handle unauthenticated users - return null without error
    if (response.status === 401) {
      logger.info('[checkEnrollmentStatus] User not authenticated')
      return {
        message: 'Not authenticated',
        data: null
      }
    }

    if (response.status === 404) {
      // No enrollment found - this is normal
      return {
        message: 'No enrollment found',
        data: null
      }
    }

    if (!response.ok) {
      logger.error('[checkEnrollmentStatus] API error:', response.status)
      return {
        message: 'Error checking enrollment',
        data: null
      }
    }

    return response.json()
  } catch (error) {
    logger.error('[checkEnrollmentStatus] Error:', error)
    return {
      message: 'Error checking enrollment',
      data: null
    }
  }
}

/**
 * Single-step enrollment with payment (RECOMMENDED)
 * Uses the backend endpoint: POST /api/v1/training-enrollments/{trainingId}/enroll-with-payment
 * Combines enrollment creation and payment submission in one atomic transaction
 * Also handles free trainings (amount = 0)
 */
export async function enrollWithPayment(
  trainingId: number,
  paymentData: {
    amount: number
    paymentMethod: 'FONE_PAY_QR' | 'BANK_TRANSFER'
    transactionReference?: string
    remarks: string
    proofFile: File | null
  }
): Promise<TrainingEnrollmentResponse> {
  logger.debug('[enrollWithPayment] Starting enrollment', { trainingId, paymentMethod: paymentData.paymentMethod, amount: paymentData.amount })
  
  // Validate trainingId
  if (typeof trainingId !== 'number' || isNaN(trainingId) || trainingId <= 0) {
    logger.error('[enrollWithPayment] Invalid trainingId:', trainingId)
    throw new Error('Invalid training ID')
  }

  // Validate payment data
  if (typeof paymentData.amount !== 'number' || paymentData.amount < 0) {
    logger.error('[enrollWithPayment] Invalid amount:', paymentData.amount)
    throw new Error('Invalid payment amount')
  }
  
  // For paid trainings, validate payment details
  if (paymentData.amount > 0) {
    if (!paymentData.remarks?.trim()) {
      logger.error('[enrollWithPayment] Missing remarks for paid training')
      throw new Error('Payment remarks are required')
    }
    if (!paymentData.proofFile) {
      logger.error('[enrollWithPayment] Missing proof file for paid training')
      throw new Error('Payment proof file is required')
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (paymentData.proofFile.size > maxSize) {
      logger.error('[enrollWithPayment] File too large:', paymentData.proofFile.size)
      throw new Error('Payment proof file must be less than 5MB')
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(paymentData.proofFile.type)) {
      logger.error('[enrollWithPayment] Invalid file type:', paymentData.proofFile.type)
      throw new Error('Payment proof must be JPG, PNG, or PDF')
    }
  }

  const idempotencyKey = generateUUID()
  
  try {
    // Create FormData for multipart/form-data
    const formData = new FormData()
    
    // Create request JSON with enrollment and payment data
    const requestData = {
      enrollmentRemarks: 'Enrollment via web portal',
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      transactionReference: paymentData.transactionReference || '',
      paymentRemarks: paymentData.remarks || 'Free training enrollment'
    }
    
    // Add request as JSON blob with correct content type
    const requestBlob = new Blob([JSON.stringify(requestData)], { 
      type: 'application/json' 
    })
    formData.append('request', requestBlob)
    
    // Add payment proof file (only if provided for paid trainings)
    if (paymentData.proofFile) {
      formData.append('paymentProof', paymentData.proofFile)
    }
    
    const url = `/api/trainings/${trainingId}/enroll-with-payment`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Idempotency-Key': idempotencyKey,
        // Don't set Content-Type - browser will set it with boundary for multipart/form-data
      },
      body: formData,
    })

    const data = await response.json().catch(() => ({ message: 'Invalid response format' }))

    if (!response.ok) {
      logger.error('[enrollWithPayment] API error:', response.status, data)
      
      // User-friendly error messages based on status code
      if (response.status === 401) {
        throw new Error('Please sign in to enroll in this training')
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to enroll')
      }
      if (response.status === 404) {
        throw new Error('Training not found')
      }
      if (response.status === 409) {
        throw new Error('You already have a pending enrollment for this training')
      }
      if (response.status === 422) {
        throw new Error('Training has reached maximum capacity')
      }
      if (response.status === 413) {
        throw new Error('Payment proof file is too large')
      }
      if (response.status === 415) {
        throw new Error('Invalid file format. Please upload JPG, PNG, or PDF')
      }
      
      throw new Error(data.message || 'Failed to submit enrollment')
    }

    logger.info('[enrollWithPayment] Enrollment successful')
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    logger.error('[enrollWithPayment] Unexpected error:', error)
    throw new Error('Network error. Please check your connection and try again')
  }
}
