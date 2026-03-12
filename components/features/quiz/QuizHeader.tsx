'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth/useAuth'
import { getCart } from '@/services/server/cart.server'

export function QuizHeader() {
  const router = useRouter()
  const { isLoggedIn, isLoading } = useAuth()
  const [cartItemCount, setCartItemCount] = useState(0)

  const loadCartCount = useCallback(async () => {
    if (!isLoggedIn) {
      setCartItemCount(0)
      return
    }

    try {
      const response = await getCart()
      setCartItemCount(response.data.totalItems)
    } catch (error) {
      // Silent fail - cart count is not critical
      setCartItemCount(0)
    }
  }, [isLoggedIn])

  useEffect(() => {
    loadCartCount()
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCartCount()
    }
    
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [loadCartCount])

  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3 sm:mb-4">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-navy font-heading">
            Available Quizzes
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Cart Button */}
          <button
            onClick={() => router.push('/cart')}
            className="relative flex items-center gap-2 bg-white hover:bg-gray-50 text-brand-navy border-2 border-gray-200 hover:border-brand-blue font-bold py-2.5 px-4 sm:px-6 rounded-lg transition-colors whitespace-nowrap"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-navy text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* My Quizzes Button */}
          {!isLoading && isLoggedIn && (
            <button
              onClick={() => router.push('/my-enrollments')}
              className="flex items-center gap-2 bg-brand-navy hover:bg-brand-blue text-white font-bold py-2.5 px-4 sm:px-6 rounded-lg transition-colors whitespace-nowrap"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
              </svg>
              <span className="hidden sm:inline">My Quizzes</span>
            </button>
          )}
        </div>
      </div>
      <p className="text-gray-500 text-base sm:text-lg max-w-3xl">
        Prepare for your entrance exams with our professionally curated quizzes designed to simulate real exam conditions and boost your cognitive agility.
      </p>
    </div>
  )
}
