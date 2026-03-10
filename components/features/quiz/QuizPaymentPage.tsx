'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth/useAuth'
import { Spinner } from '@/components/shared/Loading'
import { submitPaymentWithProof } from '@/services/client/payment.client'
import type { Quiz } from '@/types/quiz.types'

interface QuizPaymentPageProps {
  slug: string
}

export function QuizPaymentPage({ slug }: QuizPaymentPageProps) {
  const router = useRouter()
  const { isLoggedIn, isLoading: authLoading } = useAuth()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
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
      // Store the intended destination
      sessionStorage.setItem('redirectAfterLogin', `/quiz/${slug}/payment`)
      sessionStorage.setItem('loginMessage', 'Please sign in to purchase this quiz')
      router.push('/signin')
    }
  }, [authLoading, isLoggedIn, router, slug])

  useEffect(() => {
    // TODO: Fetch quiz details by slug
    // For now, using mock data
    setTimeout(() => {
      setQuiz({
        questionSetId: 2,
        slug: 'bca-i-9cf270',
        setName: 'BCA I',
        nosOfQuestions: 10,
        durationInMinutes: 15,
        description: 'Comprehensive test for BCA first semester',
        price: 0.01,
        courseId: 2,
        courseName: 'BCA',
      })
      setIsLoading(false)
    }, 500)
  }, [slug])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Only JPG and PNG files are allowed')
        return
      }
      setReceiptFile(file)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!quiz) return
    
    // Validation
    if (!transactionRef.trim()) {
      setError('Transaction reference is required')
      return
    }
    if (!receiptFile) {
      setError('Payment receipt is required')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const paymentRequest = {
        amount: quiz.price,
        paymentMethod: 'BANK_TRANSFER' as const,
        transactionReference: transactionRef,
        remarks: remarks || `Payment for quiz: ${quiz.setName}`,
      }

      await submitPaymentWithProof(
        quiz.questionSetId,
        'QUIZ',
        paymentRequest,
        receiptFile
      )
      
      // Redirect to success page
      router.push(`/quiz/${slug}/payment/success`)
    } catch (err) {
      // User-friendly error messages
      let errorMessage = 'Failed to submit payment proof. Please try again.'
      
      if (err instanceof Error) {
        const message = err.message.toLowerCase()
        
        if (message.includes('network') || message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (message.includes('unauthorized') || message.includes('authentication')) {
          errorMessage = 'Session expired. Please log in again.'
        } else if (message.includes('file') || message.includes('upload')) {
          errorMessage = 'Failed to upload receipt. Please try a different file.'
        } else if (message.includes('already') || message.includes('duplicate')) {
          errorMessage = 'You have already submitted a payment for this quiz.'
        } else {
          // Use the error message from API if it's user-friendly
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
      console.error('Payment submission error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatPrice = (price?: number) => {
    return `NPR ${(price ?? 0).toLocaleString()}`
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

  if (!quiz) {
    return (
      <main className="flex-grow bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-error mb-4">Quiz not found</p>
            <button
              onClick={() => router.push('/quiz')}
              className="text-brand-blue hover:underline"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-grow bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-500">
          <button onClick={() => router.push('/quiz')} className="hover:text-brand-blue">
            Quizzes
          </button>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-brand-blue">Payment Submission</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-navy mb-2">
            Complete Your Enrollment
          </h1>
          <p className="text-gray-600">
            Please follow the steps below to finalize your payment for the quiz.
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
                      Amount: <span className="font-bold">NPR {quiz.price.toLocaleString()}</span>
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
                          value={quiz.price.toFixed(2)}
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
                          <span className="material-symbols-outlined text-gray-400 group-hover:text-brand-blue">
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
                    <div className="p-4 bg-error/10 border border-error rounded-lg">
                      <p className="text-error text-sm">{error}</p>
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
                          <span className="material-symbols-outlined">send</span>
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
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{quiz.setName}</p>
                    <p className="text-sm text-gray-500">
                      Includes: {quiz.nosOfQuestions} Questions + {quiz.durationInMinutes} Minutes
                    </p>
                  </div>
                  <span className="font-medium">{formatPrice(quiz.price)}</span>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(quiz.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Processing Fee</span>
                    <span>NPR 0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 text-brand-blue font-bold text-xl">
                    <span>Total Amount</span>
                    <span>{formatPrice(quiz.price)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-brand-blue/5 rounded-lg border border-brand-blue/10">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-brand-blue">verified_user</span>
                  <div>
                    <p className="text-sm font-bold text-brand-blue">Secure Payment</p>
                    <p className="text-xs text-gray-600">
                      Your transaction is verified manually by our team.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.back()}
                className="w-full mt-6 py-2 text-gray-500 hover:text-brand-blue text-sm font-medium flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Quiz
              </button>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}
