import { apiClient } from '../api/client'
import type { PaymentResponse, PaymentRequest, PaymentType, PurchaseStatusResponse } from '@/types/payment.types'

/**
 * Submit payment with proof file
 * Uses Next.js API proxy route: POST /api/payments/submit
 * Backend endpoint: POST /api/v1/payments/pay/{id}/{type}
 */
export async function submitPaymentWithProof(
  id: number,
  type: PaymentType,
  paymentData: PaymentRequest,
  proofFile: File
): Promise<PaymentResponse> {
  const formData = new FormData()
  
  // Add payment request as JSON blob
  const paymentBlob = new Blob([JSON.stringify(paymentData)], {
    type: 'application/json'
  })
  formData.append('paymentRequest', paymentBlob)
  
  // Add file
  formData.append('file', proofFile)
  
  // Add id and type for the proxy route
  formData.append('id', id.toString())
  formData.append('type', type)

  const response = await fetch('/api/payments/submit', {
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
  paymentData: PaymentRequest,
  proofFile: File
): Promise<PaymentResponse> {
  // Handle empty array
  if (!quizIds || quizIds.length === 0) {
    throw new Error('No quizzes provided for payment')
  }
  
  // Submit payment for each quiz sequentially
  // Note: This is a workaround since the backend doesn't have a bulk payment endpoint
  // We submit the same payment proof for all quizzes
  
  const results: PaymentResponse[] = []
  
  for (const quizId of quizIds) {
    try {
      const result = await submitPaymentWithProof(
        quizId,
        'QUIZ',
        paymentData,
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
