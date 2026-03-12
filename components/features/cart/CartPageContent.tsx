'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { CartItemCard } from './CartItemCard'
import { CartSummary } from './CartSummary'
import { ClearCartModal } from './ClearCartModal'
import { CenteredSpinner } from '@/components/shared/Loading'
import { getCart, removeFromCartAction, clearCartAction } from '@/services/server/cart.server'
import { useToast } from '@/components/shared/Toast'
import type { CartItem, CartResponse } from '@/types/cart.types'

interface CartPageContentProps {
  initialData?: CartResponse | null
}

export function CartPageContent({ initialData }: CartPageContentProps) {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [items, setItems] = useState<CartItem[]>(initialData?.data.items || [])
  const [totalPrice, setTotalPrice] = useState(initialData?.data.totalPrice || 0)
  const [hasPriceChanges, setHasPriceChanges] = useState(initialData?.data.hasPriceChanges || false)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const [showClearModal, setShowClearModal] = useState(false)

  const loadCart = useCallback(async () => {
    // Skip initial load if we have SSR data
    if (initialData && items.length === initialData.data.items.length) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await getCart()
      setItems(response.data.items)
      setTotalPrice(response.data.totalPrice)
      setHasPriceChanges(response.data.hasPriceChanges)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load cart'
      
      // If it's an auth error, show empty cart instead of error
      if (errorMessage.includes('sign in') || errorMessage.includes('Unauthorized')) {
        setItems([])
        setTotalPrice(0)
        setHasPriceChanges(false)
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }, [initialData, items.length])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const handleRemoveItem = async (quizId: number) => {
    try {
      const result = await removeFromCartAction(quizId)
      
      if (result.success) {
        success(result.message)
        // Refresh cart data
        await loadCart()
      } else {
        showError(result.message)
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to remove item')
    }
  }

  const handleClearAll = () => {
    setShowClearModal(true)
  }

  const handleConfirmClear = async () => {
    setShowClearModal(false)
    
    try {
      const result = await clearCartAction()
      
      if (result.success) {
        success(result.message)
        // Refresh cart data
        await loadCart()
      } else {
        showError(result.message)
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to clear cart')
    }
  }

  const handleCancelClear = () => {
    setShowClearModal(false)
  }

  const handleCheckout = () => {
    // TODO: Implement bulk payment checkout
    router.push('/checkout')
  }

  if (isLoading) {
    return (
      <main className="flex-grow bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10">
          <div className="flex justify-center items-center min-h-[400px]">
            <CenteredSpinner size="lg" text="Loading your cart..." />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-grow bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-navy tracking-tight font-heading">
            Shopping Cart
          </h1>
          <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
            Review your selected quizzes before checkout.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-12 sm:py-16">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-16 sm:size-20 mx-auto text-gray-300 mb-4 sm:mb-6">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 px-4">
              Start adding quizzes to your cart to begin your learning journey.
            </p>
            <button
              onClick={() => router.push('/quiz')}
              className="bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors text-sm sm:text-base"
            >
              Browse Quizzes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between px-2 sm:px-4 py-2 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                  Selected Items ({items.length})
                </h2>
                <button
                  onClick={handleClearAll}
                  className="text-xs sm:text-sm font-semibold text-brand-blue hover:underline"
                >
                  Clear all
                </button>
              </div>

              {/* Price Change Warning */}
              {hasPriceChanges && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 shrink-0 mt-0.5">
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold">Price changes detected</p>
                      <p className="text-xs mt-1">Some items in your cart have changed price since you added them.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Items List */}
              {items.map((item) => (
                <CartItemCard
                  key={item.cartItemId}
                  item={item}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <CartSummary
                totalItems={items.length}
                totalPrice={totalPrice}
                onCheckout={handleCheckout}
              />

              {/* Secure Checkout Badge */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl border border-gray-200 bg-white flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 sm:size-7 text-brand-blue flex-shrink-0">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                </svg>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-brand-navy leading-none">
                    Secure Checkout
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                    Your payment information is protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clear Cart Confirmation Modal */}
      {showClearModal && (
        <ClearCartModal
          itemCount={items.length}
          onConfirm={handleConfirmClear}
          onCancel={handleCancelClear}
        />
      )}
    </main>
  )
}
