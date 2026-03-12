// Server-side Cart API calls (for SSR)
// Runs on server, uses cookies for authentication

'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { CartResponse, AddToCartResponse, RemoveFromCartResponse } from '@/types/cart.types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'

/**
 * Get user's cart (Server-side)
 * Used in Server Components for SSR
 * Backend endpoint: GET /api/v1/cart
 */
export async function getCart(): Promise<CartResponse> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  if (!accessToken) {
    // Return empty cart for unauthenticated users
    return {
      message: 'Cart retrieved',
      data: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        hasPriceChanges: false,
      },
    }
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/cart`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    // Return empty cart on error instead of throwing
    return {
      message: 'Cart retrieved',
      data: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        hasPriceChanges: false,
      },
    }
  }

  return response.json()
}

/**
 * Add quiz to cart (Server Action)
 * Backend endpoint: POST /api/v1/cart/items/{quizId}
 */
export async function addToCartAction(quizId: number): Promise<{ success: boolean; message: string; data?: AddToCartResponse }> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      return {
        success: false,
        message: 'Please sign in to add items to cart',
      }
    }

    // Validate quizId
    if (!quizId || isNaN(quizId) || quizId <= 0) {
      return {
        success: false,
        message: 'Invalid quiz ID',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/cart/items/${quizId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to add item to cart',
      }
    }

    // Revalidate cart page to reflect changes
    revalidatePath('/cart')

    return {
      success: true,
      message: 'Quiz added to cart!',
      data,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to add item to cart',
    }
  }
}

/**
 * Remove quiz from cart (Server Action)
 * Backend endpoint: DELETE /api/v1/cart/items/{quizId}
 */
export async function removeFromCartAction(quizId: number): Promise<{ success: boolean; message: string }> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      return {
        success: false,
        message: 'Please sign in to remove items from cart',
      }
    }

    // Validate quizId
    if (!quizId || isNaN(quizId) || quizId <= 0) {
      return {
        success: false,
        message: 'Invalid quiz ID',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/cart/items/${quizId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to remove item from cart',
      }
    }

    // Revalidate cart page to reflect changes
    revalidatePath('/cart')

    return {
      success: true,
      message: 'Item removed from cart',
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to remove item from cart',
    }
  }
}

/**
 * Clear entire cart (Server Action)
 * Backend endpoint: DELETE /api/v1/cart
 */
export async function clearCartAction(): Promise<{ success: boolean; message: string }> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      return {
        success: false,
        message: 'Please sign in to clear your cart',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/cart`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to clear cart',
      }
    }

    // Revalidate cart page to reflect changes
    revalidatePath('/cart')

    return {
      success: true,
      message: 'Cart cleared',
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to clear cart',
    }
  }
}
