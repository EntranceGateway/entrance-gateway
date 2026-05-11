export type SubscriptionPlan = 'SILVER' | 'GOLD' | 'PREMIUM'

export interface SubscriptionPlanResponse {
  plan: SubscriptionPlan
  name: string
  price: number
  durationDays: number
  features: string[]
  maxQuizzesPerMonth: number
  maxQuestionsPerQuiz: number
  analyticsEnabled: boolean
  mentorSupport: boolean
}

export interface SubscriptionStatusResponse {
  currentPlan: SubscriptionPlan | null
  planName: string | null
  startDate: string | null
  endDate: string | null
  remainingDays: number
  quizzesUsedThisMonth: number
  quizzesLimitPerMonth: number
  isActive: boolean
  autoRenew: boolean
  subscriptionId?: number
  purchaseId?: number
  paymentId?: number
}

export interface UpgradePriceResponse {
  currentPlan: SubscriptionPlan | null
  targetPlan: SubscriptionPlan
  currentPlanRemainingDays: number
  currentPlanDailyRate: number
  currentPlanCredit: number
  targetPlanPrice: number
  finalUpgradePrice: number
  currency: string
}

export interface SubscriptionPlansResponse {
  message?: string
  data: SubscriptionPlanResponse[]
}

export interface MySubscriptionResponse {
  message?: string
  data: SubscriptionStatusResponse | null
}

export interface UpgradePriceApiResponse {
  message?: string
  data: UpgradePriceResponse
}
