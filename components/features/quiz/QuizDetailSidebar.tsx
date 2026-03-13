'use client'

import { useEffect } from 'react'
import type { Quiz } from '@/types/quiz.types'
import type { PurchaseStatus } from '@/types/payment.types'

interface QuizDetailSidebarProps {
  quiz: Quiz | null
  isOpen: boolean
  onClose: () => void
  purchaseStatus?: PurchaseStatus
}

export function QuizDetailSidebar({ quiz, isOpen, onClose, purchaseStatus = 'NOT_PURCHASED' }: QuizDetailSidebarProps) {
  // Disable body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!quiz) return null

  const formatPrice = (price?: number) => {
    return `NPR ${(price ?? 0).toLocaleString()}`
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[450px] lg:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-brand-navy">
              Quiz Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-grow overflow-y-auto p-4 sm:p-6">
            {/* Category Badge */}
            <div className="mb-4 sm:mb-6">
              <span className="inline-block bg-brand-lavender text-brand-purple text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {quiz.courseName}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-brand-navy mb-3 sm:mb-4">
              {quiz.setName}
            </h3>

            {/* Description */}
            {quiz.description && quiz.description.trim() && (
              <div className="mb-4 sm:mb-6">
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {quiz.description}
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center text-gray-700">
                  <span className="material-symbols-outlined text-brand-blue mr-2 sm:mr-3 text-[18px] sm:text-[20px]">quiz</span>
                  <span className="font-medium text-sm sm:text-base">Questions</span>
                </div>
                <span className="text-brand-navy font-bold text-sm sm:text-base">
                  {quiz.nosOfQuestions}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center text-gray-700">
                  <span className="material-symbols-outlined text-brand-blue mr-2 sm:mr-3 text-[18px] sm:text-[20px]">schedule</span>
                  <span className="font-medium text-sm sm:text-base">Duration</span>
                </div>
                <span className="text-brand-navy font-bold text-sm sm:text-base">
                  {quiz.durationInMinutes} Minutes
                </span>
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center text-gray-700">
                  <span className="material-symbols-outlined text-brand-blue mr-2 sm:mr-3 text-[18px] sm:text-[20px]">menu_book</span>
                  <span className="font-medium text-sm sm:text-base">Course</span>
                </div>
                <span className="text-brand-navy font-bold text-sm sm:text-base">
                  {quiz.courseName}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 bg-brand-gold/10 rounded-lg border border-brand-gold/30">
                <div className="flex items-center text-gray-700">
                  <span className="material-symbols-outlined text-brand-gold mr-2 sm:mr-3 text-[18px] sm:text-[20px]">payments</span>
                  <span className="font-medium text-sm sm:text-base">Price</span>
                </div>
                <span className="text-brand-navy font-bold text-base sm:text-lg">
                  {formatPrice(quiz.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions - Fixed at bottom */}
          <div className="p-4 sm:p-6 border-t border-gray-200 flex-shrink-0">
            {purchaseStatus === 'NOT_PURCHASED' && (
              <button
                onClick={() => {
                  // Check if user is authenticated by checking userId cookie
                  const cookies = document.cookie.split(';')
                  const userIdCookie = cookies.find(c => c.trim().startsWith('userId='))
                  const isAuth = !!userIdCookie
                  
                  if (!isAuth) {
                    sessionStorage.setItem('redirectAfterLogin', `/quiz/${quiz.slug || quiz.questionSetId}/payment`)
                    sessionStorage.setItem('loginMessage', 'Please sign in to purchase this quiz')
                    window.location.href = '/signin'
                  } else {
                    window.location.href = `/quiz/${quiz.slug || quiz.questionSetId}/payment`
                  }
                }}
                className="w-full bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
              >
                Buy Now
              </button>
            )}

            {purchaseStatus === 'PENDING' && (
              <div className="text-center">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-brand-blue font-medium">Payment in progress...</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-200 text-gray-700 font-bold py-2.5 sm:py-3 rounded-lg text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            )}

            {(purchaseStatus === 'APPROVAL_PENDING' || purchaseStatus === 'PAYMENT_RECEIVED_ADMIN_APPROVAL_PENDING') && (
              <div className="text-center">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-amber-800 font-medium">Awaiting Admin Approval</p>
                  <p className="text-xs text-amber-600 mt-1">Your payment is being reviewed</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-200 text-gray-700 font-bold py-2.5 sm:py-3 rounded-lg text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            )}

            {(purchaseStatus === 'PAID' || purchaseStatus === 'ACTIVE') && (
              <button
                onClick={() => {
                  window.location.href = `/quiz/${quiz.questionSetId}/start`
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
              >
                Start Quiz
              </button>
            )}

            {(purchaseStatus === 'FAILED' || purchaseStatus === 'PAYMENT_FAILED' || purchaseStatus === 'CANCELLED') && (
              <button
                onClick={() => {
                  // Check if user is authenticated by checking userId cookie
                  const cookies = document.cookie.split(';')
                  const userIdCookie = cookies.find(c => c.trim().startsWith('userId='))
                  const isAuth = !!userIdCookie
                  
                  if (!isAuth) {
                    sessionStorage.setItem('redirectAfterLogin', `/quiz/${quiz.slug || quiz.questionSetId}/payment`)
                    sessionStorage.setItem('loginMessage', 'Please sign in to retry payment')
                    window.location.href = '/signin'
                  } else {
                    window.location.href = `/quiz/${quiz.slug || quiz.questionSetId}/payment`
                  }
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
              >
                Retry Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
