// Client-side Cart API calls (for CSR)
// Uses Next.js API routes as proxy to backend

import type {
  CartResponse,
  AddToCartResponse,
  RemoveFromCartResponse,
} from '@/types/cart.types'

/**
 * Get user's cart
 * Uses Next.js API proxy route: GET /api/cart
 * Backend endpoint: GET /api/v1/cart
 */
export async function fetchCart(): Promise<CartResponse> {
  const response = await fetch('/api/cart', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({ message: 'Failed to fetch cart' }))
    throw new Error(data.message || 'Failed to fetch cart')
  }

  const data = await response.json()
  
  // Ensure data structure is valid
  if (!data.data) {
    throw new Error('Invalid cart response format')
  }

  return data
}

/**
 * Add quiz to cart
 * Uses Next.js API proxy route: POST /api/cart/items/[quizId]
 * Backend endpoint: POST /api/v1/cart/items/{quizId}
 */
export async function addToCart(quizId: number): Promise<AddToCartResponse> {
  // Validate quizId
  if (!quizId || isNaN(quizId) || quizId <= 0) {
    throw new Error('Invalid quiz ID')
  }

  const response = await fetch(`/api/cart/items/${quizId}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to add item to cart')
  }

  return data
}

/**
 * Remove quiz from cart
 * Uses Next.js API proxy route: DELETE /api/cart/items/[quizId]
 * Backend endpoint: DELETE /api/v1/cart/items/{quizId}
 */
export async function removeFromCart(quizId: number): Promise<RemoveFromCartResponse> {
  // Validate quizId
  if (!quizId || isNaN(quizId) || quizId <= 0) {
    throw new Error('Invalid quiz ID')
  }

  const response = await fetch(`/api/cart/items/${quizId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to remove item from cart')
  }

  return data
}

/**
 * Clear entire cart
 * Uses Next.js API proxy route: DELETE /api/cart
 * Backend endpoint: DELETE /api/v1/cart
 */
export async function clearCart(): Promise<RemoveFromCartResponse> {
  const response = await fetch('/api/cart', {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to clear cart')
  }

  return data
}
