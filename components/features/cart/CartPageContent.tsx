'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CartItemCard } from './CartItemCard'
import { CartSummary } from './CartSummary'
import { CenteredSpinner } from '@/components/shared/Loading'
import type { CartItem, CartSummary as CartSummaryType } from '@/types/cart.types'

export function CartPageContent() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [summary, setSummary] = useState<CartSummaryType>({
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    itemCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      // const response = await fetchCart()
      
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockItems: CartItem[] = [
        {
          id: 1,
          type: 'QUIZ',
          name: 'Medical Entrance Mock Test 1',
          slug: 'medical-entrance-mock-1',
          description: 'Comprehensive full-length practice exam with video solutions.',
          price: 500.00,
          originalPrice: 600.00,
          category: 'Academic',
          metadata: {
            questions: 100,
            duration: 60,
            courseName: 'MBBS',
          },
        },
        {
          id: 2,
          type: 'TRAINING',
          name: 'Java Backend Bootcamp',
          slug: 'java-backend-bootcamp',
          description: '12-week intensive course on Spring Boot and Cloud architecture.',
          price: 2999.00,
          category: 'Professional',
          metadata: {
            duration: 720,
          },
        },
      ]

      setItems(mockItems)
      calculateSummary(mockItems)
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateSummary = (cartItems: CartItem[]) => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.originalPrice || item.price), 0)
    const actualTotal = cartItems.reduce((sum, item) => sum + item.price, 0)
    const discount = subtotal - actualTotal
    const tax = actualTotal * 0.05 // 5% tax
    const total = actualTotal + tax

    setSummary({
      subtotal,
      discount,
      tax,
      total,
      itemCount: cartItems.length,
    })
  }

  const handleRemoveItem = async (id: number) => {
    try {
      // TODO: Call API to remove item
      // await removeFromCart(id)
      
      const updatedItems = items.filter(item => item.id !== id)
      setItems(updatedItems)
      calculateSummary(updatedItems)
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  const handleSaveForLater = async (id: number) => {
    try {
      // TODO: Call API to save for later
      // await saveForLater(id)
      
      const updatedItems = items.filter(item => item.id !== id)
      setItems(updatedItems)
      calculateSummary(updatedItems)
    } catch (error) {
      console.error('Failed to save for later:', error)
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all items from your cart?')) {
      return
    }

    try {
      // TODO: Call API to clear cart
      // await clearCart()
      
      setItems([])
      calculateSummary([])
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    try {
      // TODO: Implement checkout logic
      // await initiateCheckout()
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/checkout')
    } catch (error) {
      console.error('Checkout failed:', error)
    } finally {
      setIsProcessing(false)
    }
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
            Enrollment Cart
          </h1>
          <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
            Review your selected courses and professional certifications.
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-12 sm:py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-gray-400 text-4xl sm:text-5xl">
                shopping_cart
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 px-4">
              Start adding courses and quizzes to your cart to begin your learning journey.
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

              {/* Items List */}
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveItem}
                  onSaveForLater={handleSaveForLater}
                />
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <CartSummary
                summary={summary}
                onCheckout={handleCheckout}
                isProcessing={isProcessing}
              />

              {/* Money Back Guarantee */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl border border-gray-200 bg-white flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-blue text-2xl sm:text-3xl flex-shrink-0">
                  verified_user
                </span>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-brand-navy leading-none">
                    30-Day Money Back
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                    Guaranteed satisfaction on all courses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
