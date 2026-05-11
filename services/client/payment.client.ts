import type { PaymentResponse, PaymentRequest, PaymentType, PurchaseStatusResponse, PaymentMethod } from '@/types/payment.types'
interface InitiateSubscriptionPaymentRequest {
  moduleId: string
  moduleType: 'SUBSCRIPTION'
  amount: number
  paymentMethod: PaymentMethod
  entranceTypeSlug?: string | null
  isUpgrade?: boolean
}

interface InitiatePaymentResponse {
  message: string
  data?: {
    paymentUrl?: string
    redirectUrl?: string
    transactionUuid?: string
    paymentId?: number
    // eSewa-specific fields
    esewaUrl?: string
    amount?: string
    taxAmount?: string
    totalAmount?: string
    productCode?: string
    productServiceCharge?: string
    productDeliveryCharge?: string
    successUrl?: string
    failureUrl?: string
    signedFieldNames?: string
    signature?: string
    // Khalti-specific fields
    pidx?: string
    khaltiUrl?: string
    [key: string]: unknown
  }
}

interface ManualSubscriptionPaymentInput {
  id: string | number
  moduleId: string
  amount: number
  remarks: string
  transactionReference: string
  entranceTypeSlug?: string | null
  userEmail?: string
  idempotencyKey?: string
  isUpgrade?: boolean
}

/**
 * Submit payment with proof file
 * Uses Next.js API proxy route: POST /api/payments/submit
 * Backend endpoint: POST /api/v1/payments/pay/{id}/{type}
 */
export async function submitPaymentWithProof(
  id: string | number,
  type: PaymentType,
  paymentData: PaymentRequest,
  proofFile?: File | null
): Promise<PaymentResponse> {
  if (id === null || id === undefined || String(id).trim().length === 0) {
    throw new Error('Invalid payment target.')
  }

  if (!Number.isFinite(paymentData.amount) || paymentData.amount <= 0) {
    throw new Error('Payment amount must be greater than zero.')
  }

  if (proofFile) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    const maxFileSizeBytes = 5 * 1024 * 1024

    if (!allowedTypes.includes(proofFile.type)) {
      throw new Error('Receipt must be a JPG, PNG, WEBP, or PDF file.')
    }

    if (proofFile.size > maxFileSizeBytes) {
      throw new Error('Receipt file must be 5MB or smaller.')
    }
  }

  const formData = new FormData()
  
  // Add payment request as JSON blob
  const paymentBlob = new Blob([JSON.stringify(paymentData)], {
    type: 'application/json'
  })
  formData.append('request', paymentBlob)
  
  // Add optional file
  if (proofFile) {
    formData.append('file', proofFile)
  }
  
  const response = await fetch(`/api/payments/pay/${id}/${type}`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    let errorMessage = 'Payment submission failed'
    
    try {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } else {
        const errorText = await response.text()
        errorMessage = errorText || errorMessage
      }
    } catch (parseError) {
      // If parsing fails, use default error message
      console.error('Error parsing error response:', parseError)
    }
    
    throw new Error(errorMessage)
  }

  try {
    return await response.json()
  } catch (parseError) {
    console.error('Error parsing success response:', parseError)
    throw new Error('Invalid response from server')
  }
}

/**
 * Submit bulk payment for multiple quizzes with proof file
 * Submits payment for all quizzes in the cart
 */
export async function submitBulkPaymentWithProof(
  quizIds: number[],
  quizPrices: number[],
  paymentData: PaymentRequest,
  proofFile: File
): Promise<PaymentResponse> {
  // Handle empty array
  if (!quizIds || quizIds.length === 0) {
    throw new Error('No quizzes provided for payment')
  }
  
  if (quizPrices.length !== quizIds.length) {
    throw new Error('Quiz IDs and prices count mismatch')
  }
  
  // Submit payment for each quiz sequentially with its individual price
  // Note: This is a workaround since the backend doesn't have a bulk payment endpoint
  // We submit the same payment proof for all quizzes but with individual prices
  
  const results: PaymentResponse[] = []
  
  for (let i = 0; i < quizIds.length; i++) {
    const quizId = quizIds[i]
    const quizPrice = quizPrices[i]
    
    try {
      // Create payment request with individual quiz price
      const individualPaymentData = {
        ...paymentData,
        amount: quizPrice,
      }
      
      const result = await submitPaymentWithProof(
        quizId,
        'QUIZ',
        individualPaymentData,
        proofFile
      )
      results.push(result)
    } catch (error) {
      // If any payment fails, throw error
      throw new Error(`Failed to submit payment for quiz ${quizId}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  // Return the last result (all should be similar)
  return results[results.length - 1]
}

/**
 * Check purchase status for a quiz
 * Uses Next.js API proxy route: GET /api/payments/status/{quizId}
 */
export async function checkPurchaseStatus(
  quizId: number
): Promise<PurchaseStatusResponse> {
  try {
    const response = await fetch(`/api/payments/status/${quizId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json()
    return data
  } catch (error) {
    // Silent error handling - return default NOT_PURCHASED status
    return {
      message: 'Quiz purchase status',
      data: {
        status: 'NOT_PURCHASED',
        purchaseId: null,
        purchaseDate: null,
        amountPaid: null,
      },
    }
  }
}

export async function initiateSubscriptionPayment(
  payload: InitiateSubscriptionPaymentRequest
): Promise<InitiatePaymentResponse> {
  const response = await fetch('/api/payments/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data: InitiatePaymentResponse = await response.json().catch(() => ({
    message: 'Invalid payment initiation response',
  }))

  if (!response.ok) {
    throw new Error(data.message || 'Unable to initiate subscription payment.')
  }

  return data
}

export async function submitSubscriptionManualPaymentProof(
  payload: ManualSubscriptionPaymentInput,
  proofFile?: File | null
): Promise<PaymentResponse> {
  const trimmedEmail = payload.userEmail?.trim()
  const safeUserEmail = trimmedEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
    ? trimmedEmail
    : undefined

  return submitPaymentWithProof(
    payload.id,
    'SUBSCRIPTION',
    {
      amount: payload.amount,
      paymentMethod: 'MANUAL',
      remarks: payload.remarks,
      transactionReference: payload.transactionReference,
      moduleId: payload.moduleId,
      moduleType: 'SUBSCRIPTION',
      userEmail: safeUserEmail,
      idempotencyKey: payload.idempotencyKey || crypto.randomUUID(),
      entranceTypeSlug: payload.entranceTypeSlug,
      isUpgrade: payload.isUpgrade,
    },
    proofFile
  )
}
