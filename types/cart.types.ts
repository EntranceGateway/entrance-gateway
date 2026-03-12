// Cart API Types

export interface CartItem {
  cartItemId: number
  quizId: number
  quizName: string
  quizSlug: string
  nosOfQuestions: number
  durationInMinutes: number
  currentPrice: number
  priceAtAddition: number
  priceChanged: boolean
  courseId: number | null
  courseName: string | null
  addedAt: string
}

export interface CartData {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  hasPriceChanges: boolean
}

export interface CartResponse {
  message: string
  data: CartData
}

export interface AddToCartResponse {
  message: string
  data: CartItem
}

export interface RemoveFromCartResponse {
  message: string
  data: null
}
