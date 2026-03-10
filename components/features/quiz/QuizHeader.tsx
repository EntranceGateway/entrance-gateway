'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth/useAuth'

export function QuizHeader() {
  const router = useRouter()
  const { isLoggedIn, isLoading } = useAuth()
  const [cartItemCount, setCartItemCount] = useState(0)

  useEffect(() => {
    // TODO: Fetch cart item count from API or localStorage
    // For now, using mock data
    const mockCartCount = 2
    setCartItemCount(mockCartCount)
  }, [])

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
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
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
              <span className="material-symbols-outlined text-[20px]">library_books</span>
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
