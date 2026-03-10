// Shopping Cart Types

export interface CartItem {
  id: number
  type: 'QUIZ' | 'TRAINING' | 'COURSE'
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  category: string
  imageUrl?: string
  metadata: {
    questions?: number
    duration?: number
    courseName?: string
  }
}

export interface CartSummary {
  subtotal: number
  discount: number
  tax: number
  total: number
  itemCount: number
}

export interface CartResponse {
  message: string
  data: {
    items: CartItem[]
    summary: CartSummary
  }
}
