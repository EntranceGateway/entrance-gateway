// Enrollment/Purchase Types

import type { PurchaseStatus } from './payment.types'

export interface QuizPurchase {
  purchaseId: number
  purchaseStatus: PurchaseStatus
  purchaseDate: string
  amountPaid: number
  quizId: number
  quizName: string
  quizSlug: string
  nosOfQuestions: number
  durationInMinutes: number
  quizPrice: number
  courseId: number
  courseName: string
}

export interface MyPurchasesResponse {
  message: string
  data: QuizPurchase[]
}
