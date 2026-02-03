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
  // Validate trainingId
  if (!trainingId || isNaN(trainingId) || trainingId <= 0) {
    console.error('Invalid trainingId:', trainingId)
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
 * Single-step enrollment with payment (RECOMMENDED)
 * Uses the backend endpoint: POST /api/v1/training-enrollments/{trainingId}/enroll-with-payment
 * Combines enrollment creation and payment submission in one atomic transaction
 */
export async function enrollWithPayment(
  trainingId: number,
  paymentData: {
    amount: number
    paymentMethod: 'FONE_PAY_QR' | 'BANK_TRANSFER'
    transactionReference?: string
    remarks: string
    proofFile: File
  }
): Promise<TrainingEnrollmentResponse> {
  console.log('=== enrollWithPayment START ===')
  console.log('trainingId:', trainingId)
  console.log('trainingId type:', typeof trainingId)
  console.log('paymentData:', {
    amount: paymentData.amount,
    paymentMethod: paymentData.paymentMethod,
    transactionReference: paymentData.transactionReference,
    remarks: paymentData.remarks,
    proofFileName: paymentData.proofFile.name
  })
  
  // Validate trainingId
  if (!trainingId || isNaN(trainingId) || trainingId <= 0) {
    console.error('❌ Invalid trainingId in enrollWithPayment')
    console.error('trainingId:', trainingId)
    throw new Error('Invalid training ID')
  }

  // Validate payment data
  if (!paymentData.amount || paymentData.amount <= 0) {
    console.error('❌ Invalid amount')
    throw new Error('Invalid payment amount')
  }
  if (!paymentData.remarks || !paymentData.remarks.trim()) {
    console.error('❌ Invalid remarks')
    throw new Error('Payment remarks are required')
  }
  if (!paymentData.proofFile) {
    console.error('❌ Missing proof file')
    throw new Error('Payment proof file is required')
  }

  console.log('✅ All validations passed in enrollWithPayment')

  const idempotencyKey = generateUUID()
  console.log('Generated idempotency key:', idempotencyKey)
  
  // Create FormData for multipart/form-data
  const formData = new FormData()
  
  // Create request JSON with enrollment and payment data
  const requestData = {
    enrollmentRemarks: 'Enrollment via web portal',
    amount: paymentData.amount,
    paymentMethod: paymentData.paymentMethod,
    transactionReference: paymentData.transactionReference || '',
    paymentRemarks: paymentData.remarks
  }
  
  console.log('Request data:', requestData)
  
  // Add request as JSON blob with correct content type
  const requestBlob = new Blob([JSON.stringify(requestData)], { 
    type: 'application/json' 
  })
  formData.append('request', requestBlob)
  
  // Add payment proof file
  formData.append('paymentProof', paymentData.proofFile)
  
  const url = `/api/trainings/${trainingId}/enroll-with-payment`
  console.log('Making request to:', url)
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Idempotency-Key': idempotencyKey,
      // Don't set Content-Type - browser will set it with boundary for multipart/form-data
    },
    body: formData,
  })

  console.log('Response status:', response.status)
  console.log('Response ok:', response.ok)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('❌ API Error Response:', errorData)
    throw new Error(errorData.message || `Failed to enroll with payment: ${response.statusText}`)
  }

  const result = await response.json()
  console.log('✅ Success response:', result)
  console.log('=== enrollWithPayment END ===')
  
  return result
}
