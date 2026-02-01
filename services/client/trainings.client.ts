// Client-side Trainings API calls (for CSR)
// Uses Next.js API routes as proxy to backend

import type {
  TrainingsListResponse,
  TrainingDetailResponse,
  TrainingsQueryParams,
  TrainingEnrollmentResponse,
  PaymentResponse,
} from '@/types/trainings.types'
import { generateUUID } from '@/lib/utils/uuid'

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

  const response = await fetch(`/api/trainings?${queryParams}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch trainings: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetch single training by ID (Client-side via proxy)
 * Used in Client Components
 */
export async function fetchTrainingById(id: string): Promise<TrainingDetailResponse> {
  const response = await fetch(`/api/trainings/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch training: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Check if user has an existing enrollment for a training
 * Returns enrollment status if exists, null if not enrolled
 */
export async function checkEnrollmentStatus(trainingId: number): Promise<TrainingEnrollmentResponse | null> {
  try {
    const response = await fetch(`/api/trainings/${trainingId}/enrollment-status`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    if (response.status === 404) {
      // No enrollment found
      return {
        message: 'No enrollment found',
        data: null
      }
    }

    if (!response.ok) {
      throw new Error(`Failed to check enrollment status: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error checking enrollment status:', error)
    return {
      message: 'Error checking enrollment',
      data: null
    }
  }
}

/**
 * Create initial enrollment (Step 1 - Personal Detail)
 * This creates the enrollment record before payment
 */
export async function createEnrollment(trainingId: number): Promise<TrainingEnrollmentResponse> {
  const idempotencyKey = generateUUID()
  
  const response = await fetch(`/api/trainings/${trainingId}/enroll`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to create enrollment: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Submit manual payment with proof for training enrollment
 * Uses the payment API endpoint: POST /api/v1/payments/pay/{id}/{type}
 */
export async function submitTrainingPayment(
  trainingId: number,
  paymentData: {
    amount: number
    paymentMethod: string
    remarks: string
    proofFile: File
  }
): Promise<PaymentResponse> {
  // Create FormData for multipart/form-data
  const formData = new FormData()
  
  // Add payment request as JSON blob with correct content type
  const requestData = {
    amount: paymentData.amount,
    paymentMethod: paymentData.paymentMethod,
    remarks: paymentData.remarks
  }
  
  // Create a Blob with application/json content type
  const requestBlob = new Blob([JSON.stringify(requestData)], { 
    type: 'application/json' 
  })
  formData.append('request', requestBlob)
  
  // Add file
  formData.append('file', paymentData.proofFile)
  
  const response = await fetch(`/api/payments/pay/${trainingId}/TRAINING`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      // Don't set Content-Type - browser will set it with boundary for multipart/form-data
    },
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to submit payment: ${response.statusText}`)
  }

  return response.json()
}

/**
 * @deprecated Use createEnrollment() and submitTrainingPayment() separately
 * Enroll in a training program with payment (Final submission)
 * Generates Idempotency-Key automatically
 * Sends multipart/form-data with payment proof file
 */
export async function enrollInTraining(
  trainingId: number,
  paymentData: {
    amount: number
    paymentMethod: string
    remarks: string
    proofFile: File
  }
): Promise<TrainingEnrollmentResponse> {
  const idempotencyKey = generateUUID()
  
  // Create FormData for multipart/form-data
  const formData = new FormData()
  
  // Add payment request as JSON blob
  const requestData = {
    amount: paymentData.amount,
    paymentMethod: paymentData.paymentMethod,
    remarks: paymentData.remarks
  }
  formData.append('request', new Blob([JSON.stringify(requestData)], { type: 'application/json' }))
  
  // Add file
  formData.append('file', paymentData.proofFile)
  
  const response = await fetch(`/api/trainings/${trainingId}/enroll`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Idempotency-Key': idempotencyKey,
      // Don't set Content-Type - browser will set it with boundary for multipart/form-data
    },
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to enroll in training: ${response.statusText}`)
  }

  return response.json()
}
