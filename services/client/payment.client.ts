import { apiClient } from '../api/client'
import type { PaymentResponse, PaymentRequest, PaymentType, PurchaseStatusResponse } from '@/types/payment.types'

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

  // Get access token from cookie
  const accessToken = getAccessToken()
  const headers: HeadersInit = {}
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'}/api/v1/payments/pay/${id}/${type}`,
    {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    }
  )

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

export async function checkPurchaseStatus(
  quizId: number
): Promise<PurchaseStatusResponse> {
  try {
    // Get access token from cookie
    const accessToken = getAccessToken()
    
    return await apiClient<PurchaseStatusResponse>(
      `/api/v1/purchases/quizzes/${quizId}/status`,
      {
        headers: accessToken ? {
          'Authorization': `Bearer ${accessToken}`,
        } : {},
      }
    )
  } catch (error) {
    // Silent error handling - authentication errors are expected for non-logged-in users
    // Return default NOT_PURCHASED status without logging
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

/**
 * Get access token from cookie (client-side)
 */
function getAccessToken(): string | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  const tokenCookie = cookies.find(c => c.trim().startsWith('accessToken='))
  
  if (!tokenCookie) return null
  
  return tokenCookie.split('=')[1]
}
