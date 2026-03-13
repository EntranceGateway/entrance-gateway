'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth/useAuth'
import { Spinner } from '@/components/shared/Loading'
import { submitBulkPaymentWithProof } from '@/services/client/payment.client'
import { getCart, clearCartAction } from '@/services/server/cart.server'
import { useToast } from '@/components/shared/Toast'
import type { CartItem } from '@/types/cart.types'

export function CartPaymentPage() {
  const router = useRouter()
  const { isLoggedIn, isLoading: authLoading } = useAuth()
  const { success, error: showError } = useToast()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Payment form state
  const [transactionRef, setTransactionRef] = useState('')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [remarks, setRemarks] = useState('')

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      sessionStorage.setItem('redirectAfterLogin', '/cart/payment')
      sessionStorage.setItem('loginMessage', 'Please sign in to complete your purchase')
      router.push('/signin')
    }
  }, [authLoading, isLoggedIn, router])

  // Load cart data
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getCart()
        
        // Defensive check for response.data
        if (!response?.data) {
          showError('Unable to load cart. Please try again.')
          router.push('/cart')
          return
        }
        
        if (response.data.items.length === 0) {
          showError('Your cart is empty')
          router.push('/cart')
          return
        }

        setCartItems(response.data.items)
        setTotalAmount(response.data.totalPrice)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load cart'
        console.error('Cart loading error:', err)
        showError('Unable to load cart items')
        router.push('/cart')
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading && isLoggedIn) {
      loadCart()
    }
  }, [authLoading, isLoggedIn, router, showError])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB')
        setError('File size must be less than 5MB')
        return
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        showError('Only JPG and PNG files are allowed')
        setError('Only JPG and PNG files are allowed')
        return
      }
      setReceiptFile(file)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (cartItems.length === 0) {
      showError('Your cart is empty')
      return
    }
    
    // Validation
    if (!transactionRef.trim()) {
      showError('Transaction reference is required')
      setError('Transaction reference is required')
      return
    }
    if (!receiptFile) {
      showError('Payment receipt is required')
      setError('Payment receipt is required')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const paymentRequest = {
        amount: totalAmount, // This will be overridden per quiz
        paymentMethod: 'BANK_TRANSFER' as const,
        transactionReference: transactionRef,
        remarks: remarks || `Payment for ${cartItems.length} quiz(zes)`,
      }

      // Extract quiz IDs and prices from cart items
      const quizIds = cartItems.map(item => item.quizId)
      const quizPrices = cartItems.map(item => item.currentPrice)

      await submitBulkPaymentWithProof(
        quizIds,
        quizPrices,
        paymentRequest,
        receiptFile
      )
      
      // Clear cart after successful payment
      try {
        await clearCartAction()
      } catch (clearError) {
        // Silent error - log but don't fail
        console.error('Failed to clear cart after payment:', clearError)
      }
      
      success('Payment submitted successfully! Redirecting...')
      
      // Small delay to show success message
      setTimeout(() => {
        router.push('/cart/payment/success')
      }, 1000)
    } catch (err) {
      console.error('Payment submission error:', err)
      
      let errorMessage = 'Failed to submit payment. Please try again.'
      
      if (err instanceof Error) {
        const message = err.message.toLowerCase()
        
        if (message.includes('network') || message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection.'
        } else if (message.includes('unauthorized') || message.includes('authentication') || message.includes('session')) {
          errorMessage = 'Session expired. Please log in again.'
          setTimeout(() => router.push('/signin'), 2000)
        } else if (message.includes('file') || message.includes('upload')) {
          errorMessage = 'Failed to upload receipt. Please try a different file.'
        } else if (message.includes('amount') || message.includes('price')) {
          errorMessage = 'Payment amount validation failed. Please refresh and try again.'
        } else if (err.message && err.message.length < 100) {
          // Use API error message if it's reasonable length
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString()}`
  }

  if (isLoading) {
    return (
      <main className="flex-grow bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Spinner size="lg" />
          </div>
        </div>
      </main>
    )
  }

  if (error && cartItems.length === 0) {
    return (
      <main className="flex-grow bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-600">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Unable to Load Cart</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/cart')}
              className="bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-grow bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-navy mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600">
            Please follow the steps below to finalize your payment for {cartItems.length} quiz{cartItems.length > 1 ? 'zes' : ''}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Step 1: Bank Details */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-brand-navy px-6 py-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-gold text-brand-navy font-bold">
                  1
                </span>
                <h2 className="text-white font-semibold text-lg">Transfer Funds</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Transfer the exact amount using either QR code or bank transfer.
                </p>

                {/* QR Code Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex flex-col items-center">
                    <h3 className="font-bold text-sm md:text-base text-brand-navy mb-2">Scan QR Code</h3>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <img
                        src="/image.png"
                        alt="Payment QR Code"
                        className="w-48 h-48 md:w-56 md:h-56 object-contain"
                      />
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 mt-3 text-center">
                      Amount: <span className="font-bold">NPR {totalAmount.toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                {/* Bank Transfer Details */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-bold text-sm md:text-base text-brand-navy mb-3">Or Bank Transfer</h3>
                  <div className="space-y-2 bg-white rounded-lg p-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-2 border-b">
                      <span className="text-xs md:text-sm text-gray-600">Account Number:</span>
                      <span className="font-mono font-bold text-sm md:text-base">34201010000602</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-2 border-b">
                      <span className="text-xs md:text-sm text-gray-600">Account Name:</span>
                      <span className="font-semibold text-xs md:text-sm">Samasta Groups Private Limited</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-2 border-b">
                      <span className="text-xs md:text-sm text-gray-600">Bank:</span>
                      <span className="font-semibold text-sm md:text-base">Global IME</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-2">
                      <span className="text-xs md:text-sm text-gray-600">Branch:</span>
                      <span className="font-semibold text-sm md:text-base">Ekantakuna</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2: Payment Proof Form */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-brand-navy px-6 py-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-gold text-brand-navy font-bold">
                  2
                </span>
                <h2 className="text-white font-semibold text-lg">Submit Payment Proof</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Amount */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Amount (NPR)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                          Rs.
                        </span>
                        <input
                          type="text"
                          value={totalAmount.toFixed(2)}
                          readOnly
                          className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Payment Method
                      </label>
                      <select
                        disabled
                        className="w-full px-4 py-2.5 bg-gray-50 border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                      >
                        <option>Bank Transfer</option>
                      </select>
                    </div>

                    {/* Transaction Reference */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Transaction Reference ID *
                      </label>
                      <input
                        type="text"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="e.g. TXN123456789"
                        className="w-full px-4 py-2.5 bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition-all"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Found on your bank receipt or SMS notification.
                      </p>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Upload Receipt (JPG/PNG) *
                      </label>
                      <div className="relative group">
                        <input
                          type="file"
                          id="receipt-upload"
                          accept="image/jpeg,image/png"
                          onChange={handleFileChange}
                          className="hidden"
                          required
                        />
                        <label
                          htmlFor="receipt-upload"
                          className="flex items-center gap-3 px-4 py-2.5 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-blue transition-colors"
                        >
                          <span className="material-symbols-outlined text-gray-400 group-hover:text-brand-blue" aria-hidden="true">
                            cloud_upload
                          </span>
                          <span className="text-sm text-gray-500">
                            {receiptFile ? receiptFile.name : 'Click to upload'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Remarks (Optional)
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Additional information regarding your payment..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition-all"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                      <p className="text-red-800 text-sm flex-1">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full md:w-auto px-10 py-3 bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <Spinner size="sm" />
                          <span>SUBMITTING...</span>
                        </>
                      ) : (
                        <>
                          <span>SUBMIT PAYMENT PROOF</span>
                          <span className="material-symbols-outlined" aria-hidden="true">send</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <aside className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-heading font-bold text-brand-navy border-b border-gray-100 pb-4 mb-4">
                Order Summary
              </h3>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{item.quizName}</p>
                      <p className="text-xs text-gray-500">
                        {item.nosOfQuestions} Questions • {item.durationInMinutes} Minutes
                      </p>
                    </div>
                    <span className="font-medium text-sm">{formatPrice(item.currentPrice)}</span>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Processing Fee</span>
                    <span>NPR 0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 text-brand-blue font-bold text-xl">
                    <span>Total Amount</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-brand-blue/5 rounded-lg border border-brand-blue/10">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-brand-blue" aria-hidden="true">verified_user</span>
                  <div>
                    <p className="text-sm font-bold text-brand-blue">Secure Payment</p>
                    <p className="text-xs text-gray-600">
                      Your transaction is verified manually by our team.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push('/cart')}
                className="w-full mt-6 py-2 text-gray-500 hover:text-brand-blue text-sm font-medium flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_back</span>
                Back to Cart
              </button>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}
