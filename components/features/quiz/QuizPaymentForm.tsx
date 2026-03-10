'use client'

import { useState } from 'react'
import type { Quiz } from '@/types/quiz.types'

interface QuizPaymentFormProps {
  quiz: Quiz
  onClose: () => void
}

export function QuizPaymentForm({ quiz, onClose }: QuizPaymentFormProps) {
  const [transactionRef, setTransactionRef] = useState('')
  const [remarks, setRemarks] = useState('')
  const [fileName, setFileName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    // Handle success
  }

  const formatPrice = (price?: number) => {
    return `${(price ?? 0).toFixed(2)}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl my-8">
        {/* Header */}
        <div className="bg-brand-navy px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-white font-heading font-bold text-xl">
            Complete Your Enrollment
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-8">
            Please follow the steps below to finalize your payment for the quiz.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Bank Details */}
              <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-brand-navy px-6 py-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-gold text-brand-navy font-bold">
                    1
                  </span>
                  <h3 className="text-white font-semibold text-lg">Transfer Funds</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    Transfer the exact amount to the bank account below via your banking app or counter deposit.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">
                        Bank Name
                      </p>
                      <p className="font-semibold text-brand-blue">Global IME Bank</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">
                        Account Name
                      </p>
                      <p className="font-semibold text-brand-blue">Academic Excellence Pvt. Ltd.</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">
                        Account Number
                      </p>
                      <p className="font-semibold text-brand-blue">0010101002020</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">
                        Branch
                      </p>
                      <p className="font-semibold text-brand-blue">Kathmandu Main</p>
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
                  <h3 className="text-white font-semibold text-lg">Submit Payment Proof</h3>
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
                            value={formatPrice(quiz.price)}
                            readOnly
                            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
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
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                        >
                          <option>Bank Transfer</option>
                        </select>
                      </div>

                      {/* Transaction Reference */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Transaction Reference ID
                        </label>
                        <input
                          type="text"
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)}
                          placeholder="e.g. TXN123456789"
                          required
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all"
                        />
                        <p className="text-xs text-gray-500">
                          Found on your bank receipt or SMS notification.
                        </p>
                      </div>

                      {/* File Upload */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Upload Receipt (JPG/PNG)
                        </label>
                        <div className="relative group">
                          <input
                            type="file"
                            id="receipt-upload"
                            accept="image/jpeg,image/png"
                            onChange={handleFileChange}
                            required
                            className="hidden"
                          />
                          <label
                            htmlFor="receipt-upload"
                            className="flex items-center gap-3 px-4 py-2.5 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-blue transition-colors"
                          >
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-brand-blue">
                              cloud_upload
                            </span>
                            <span className="text-sm text-gray-500">
                              {fileName || 'Click to upload'}
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
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto px-10 py-3 bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin material-symbols-outlined">refresh</span>
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
              <aside className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-brand-navy border-b border-gray-100 pb-4 mb-4 font-heading">
                  Order Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {quiz.setName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {quiz.nosOfQuestions} Questions • {quiz.durationInMinutes} Minutes
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>Rs. {formatPrice(quiz.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Processing Fee</span>
                      <span>Rs. 0.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 text-brand-blue font-bold text-xl">
                      <span>Total Amount</span>
                      <span>NPR {formatPrice(quiz.price)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-brand-blue/5 rounded-lg border border-brand-blue/10">
                  <div className="flex gap-3">
                    <span className="material-symbols-outlined text-brand-blue">verified_user</span>
                    <div>
                      <p className="text-sm font-bold text-brand-blue">Secure Payment</p>
                      <p className="text-xs text-gray-600">
                        Your transaction is encrypted and verified manually by our registrars.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Help Section */}
              <div className="bg-gray-100 p-6 rounded-xl border border-gray-200">
                <h4 className="text-sm font-bold text-brand-navy mb-3 font-heading">
                  Need Help?
                </h4>
                <p className="text-xs text-gray-600 mb-4">
                  If you face any issues with the bank transfer, please contact our support team.
                </p>
                <div className="flex items-center gap-2 text-brand-blue text-sm font-semibold">
                  <span className="material-symbols-outlined text-sm">phone</span>
                  <span>+977 1 45XXXXX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
