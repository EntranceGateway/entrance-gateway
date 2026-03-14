// Payment Types

export type PaymentMethod = 'BANK_TRANSFER' | 'FONE_PAY_QR' | 'ESEWA' | 'KHALTI'
export type PaymentType = 'QUIZ' | 'TRAINING' | 'COURSE'
export type PurchaseStatus = 
  | 'NOT_PURCHASED'
  | 'PENDING'
  | 'PAID'
  | 'UNPAID'
  | 'APPROVAL_PENDING'
  | 'FAILED'
  | 'PAYMENT_RECEIVED_ADMIN_APPROVAL_PENDING'
  | 'ACTIVE'
  | 'PAYMENT_FAILED'
  | 'CANCELLED'
  | 'CANCELLED_BY_ADMIN'
  | 'ABORTED'
  | 'PAYMENT_VERIFIED'
  | 'ERROR'

export interface PaymentRequest {
  amount: number
  paymentMethod: PaymentMethod
  transactionReference: string
  remarks: string
}

export interface PaymentResponse {
  message: string
  data: {
    paymentId: number
    paymentMethod: PaymentMethod
    transactionUuid: string
    totalAmount: string
    paymentDate: string
    adminPaymentProof: string
    purchaseStatus: PurchaseStatus
  }
}

export interface PurchaseStatusResponse {
  message: string
  data: {
    status: PurchaseStatus
    purchaseId: number | null
    purchaseDate: string | null
    amountPaid: number | null
  }
}
