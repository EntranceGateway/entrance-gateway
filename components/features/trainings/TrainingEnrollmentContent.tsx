'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchTrainingById, enrollWithPayment, checkEnrollmentStatus } from '@/services/client/trainings.client'
import { fetchUserProfile } from '@/services/client/user.client'
import { CenteredSpinner } from '@/components/shared/Loading'
import { useToast } from '@/components/shared/Toast'
import type { Training, TrainingDetailResponse } from '@/types/trainings.types'
import type { User } from '@/types/user.types'

interface TrainingEnrollmentContentProps {
  trainingId: string
  initialData?: TrainingDetailResponse | null
}

type PaymentMethod = 'FONE_PAY_QR' | 'BANK_TRANSFER'

interface PaymentData {
  amount: number
  paymentMethod: PaymentMethod
  transactionReference: string
  remarks: string
  proofFile: File | null
}

export function TrainingEnrollmentContent({ trainingId, initialData }: TrainingEnrollmentContentProps) {
  const router = useRouter()
  const { showToast } = useToast()
  
  const [training, setTraining] = useState<Training | null>(initialData?.data || null)
  const [userData, setUserData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: 0,
    paymentMethod: 'FONE_PAY_QR',
    transactionReference: '',
    remarks: '',
    proofFile: null
  })

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Parse and validate trainingId
        const numericId = parseInt(trainingId)
        
        if (isNaN(numericId) || numericId <= 0) {
          throw new Error('Invalid training ID')
        }

        const [trainingResponse, userResponse, enrollmentStatus] = await Promise.all([
          initialData ? Promise.resolve(initialData) : fetchTrainingById(trainingId),
          fetchUserProfile(),
          checkEnrollmentStatus(numericId)
        ])

        setTraining(trainingResponse.data)
        setUserData(userResponse.data)
        
        // Set initial payment amount
        setPaymentData(prev => ({
          ...prev,
          amount: trainingResponse.data.price
        }))

        // Check enrollment status
        if (enrollmentStatus?.data) {
          const status = enrollmentStatus.data.status
          
          if (status === 'PAYMENT_RECEIVED_ADMIN_APPROVAL_PENDING') {
            setShowSuccess(true)
            showToast('Your enrollment is pending admin approval.', 'info')
          } else if (status === 'ACTIVE' || status === 'COMPLETED') {
            showToast('You are already enrolled in this training.', 'info')
            setTimeout(() => router.push(`/trainings/${trainingId}`), 2000)
          } else if (status === 'PAYMENT_FAILED') {
            showToast('Previous payment was rejected. Please submit again.', 'warning')
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load data'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [trainingId, initialData, router, showToast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('=== handleSubmit START ===')
    console.log('trainingId:', trainingId)
    console.log('training:', training)
    console.log('userData:', userData)
    
    if (!training || !userData) {
      console.log('❌ Missing training or userData')
      return
    }

    // Parse and validate trainingId
    console.log('Parsing trainingId for submission:', trainingId)
    const numericId = parseInt(trainingId)
    console.log('Parsed numericId:', numericId)
    
    if (isNaN(numericId) || numericId <= 0) {
      console.error('❌ Invalid training ID in submit')
      showToast('Invalid training ID', 'error')
      return
    }

    console.log('✅ Training ID valid for submission:', numericId)

    // Validation
    if (!paymentData.amount || paymentData.amount <= 0) {
      console.log('❌ Invalid amount')
      showToast('Please enter a valid payment amount', 'error')
      return
    }
    if (!paymentData.remarks.trim()) {
      console.log('❌ Missing remarks')
      showToast('Please enter payment remarks', 'error')
      return
    }
    if (!paymentData.proofFile) {
      console.log('❌ Missing proof file')
      showToast('Please upload payment proof', 'error')
      return
    }

    console.log('✅ All validations passed')
    console.log('Payment data:', {
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      transactionReference: paymentData.transactionReference,
      remarks: paymentData.remarks,
      proofFileName: paymentData.proofFile.name
    })

    setIsSubmitting(true)

    try {
      console.log('Calling enrollWithPayment with numericId:', numericId)
      await enrollWithPayment(numericId, {
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        transactionReference: paymentData.transactionReference,
        remarks: paymentData.remarks,
        proofFile: paymentData.proofFile
      })
      
      console.log('✅ Enrollment successful')
      showToast('Enrollment submitted successfully! Pending admin approval.', 'success')
      setShowSuccess(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Submission failed'
      console.error('=== handleSubmit ERROR ===')
      console.error('Error:', err)
      console.error('Message:', message)
      console.error('========================')
      
      if (message.includes('already enrolled')) {
        showToast('You already have a pending enrollment.', 'warning')
      } else if (message.includes('capacity') || message.includes('full')) {
        showToast('Training has reached maximum capacity', 'error')
      } else {
        showToast(message, 'error')
      }
    } finally {
      setIsSubmitting(false)
      console.log('=== handleSubmit END ===')
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <CenteredSpinner size="lg" text="Loading enrollment form..." />
        </div>
      </main>
    )
  }

  // Error state
  if (error || !training || !userData) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 md:p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <div>
                <h3 className="font-bold text-base md:text-lg mb-1">Unable to load enrollment form</h3>
                <p className="text-sm">{error || 'Please try again later'}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href={`/trainings/${trainingId}`} className="text-sm font-medium hover:underline">
                ← Back to training details
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const availableSeats = training.maxParticipants - training.currentParticipants

  return (
    <main className="flex-grow bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

        {/* Header */}
        <div className="mb-4 md:mb-6">
          <Link
            href={`/trainings/${trainingId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-brand-navy mb-3 md:mb-4 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back to training details
          </Link>
          
          <h1 className="text-2xl md:text-3xl font-bold text-brand-navy font-heading mb-2">
            Training Enrollment
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Complete your enrollment for <span className="font-semibold">{training.trainingName}</span>
          </p>
        </div>

        {/* Success State */}
        {showSuccess ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="text-center max-w-2xl mx-auto">
              <div className="size-16 md:size-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-10 md:size-12 text-green-600">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-brand-navy mb-3 md:mb-4">
                Enrollment Submitted Successfully!
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
                Your enrollment and payment have been submitted for review. Our admin team will verify your payment within 24 hours. You will receive a confirmation email once approved.
              </p>
              <button
                onClick={() => router.push(`/trainings/${trainingId}`)}
                className="bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-3 px-6 md:px-8 rounded-lg transition-colors"
              >
                Back to Training Details
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Warning Banners */}
            <div className="mb-4 md:mb-6 space-y-3">
              <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-md p-3 md:p-4">
                <div className="flex items-start gap-2 md:gap-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 md:size-6 text-amber-600 shrink-0 mt-0.5">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs md:text-sm text-amber-900 font-medium">
                      Please verify your information. Update incorrect details in your{' '}
                      <Link href="/profile" className="font-bold underline hover:text-amber-700">
                        profile settings
                      </Link>
                      {' '}before submitting.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-600 rounded-r-md p-3 md:p-4">
                <div className="flex items-start gap-2 md:gap-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 md:size-6 text-red-600 shrink-0 mt-0.5">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs md:text-sm text-red-900 font-medium">
                      Admin will review your payment within <span className="font-bold">24 hours</span> of submission.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6 lg:p-8 space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-brand-navy mb-3 md:mb-4 font-heading">
                      Personal Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={userData.fullname}
                          disabled
                          className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={userData.email}
                          disabled
                          className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Contact</label>
                        <input
                          type="tel"
                          value={userData.contact}
                          disabled
                          className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={userData.address}
                          disabled
                          className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-brand-navy mb-3 md:mb-4 font-heading">
                      Payment Information
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">
                          Select Payment Method
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'FONE_PAY_QR' }))}
                            className={`p-3 md:p-4 border-2 rounded-lg transition-all text-left ${
                              paymentData.paymentMethod === 'FONE_PAY_QR'
                                ? 'border-brand-blue bg-brand-blue/5'
                                : 'border-gray-300 hover:border-brand-blue/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                                paymentData.paymentMethod === 'FONE_PAY_QR' ? 'border-brand-blue' : 'border-gray-300'
                              }`}>
                                {paymentData.paymentMethod === 'FONE_PAY_QR' && (
                                  <div className="size-3 rounded-full bg-brand-blue" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-sm md:text-base text-gray-900">FonePay QR</p>
                                <p className="text-xs text-gray-500">Scan QR code to pay</p>
                              </div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'BANK_TRANSFER' }))}
                            className={`p-3 md:p-4 border-2 rounded-lg transition-all text-left ${
                              paymentData.paymentMethod === 'BANK_TRANSFER'
                                ? 'border-brand-blue bg-brand-blue/5'
                                : 'border-gray-300 hover:border-brand-blue/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                                paymentData.paymentMethod === 'BANK_TRANSFER' ? 'border-brand-blue' : 'border-gray-300'
                              }`}>
                                {paymentData.paymentMethod === 'BANK_TRANSFER' && (
                                  <div className="size-3 rounded-full bg-brand-blue" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-sm md:text-base text-gray-900">Bank Transfer</p>
                                <p className="text-xs text-gray-500">Direct bank deposit</p>
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Payment Instructions */}
                      {paymentData.paymentMethod === 'FONE_PAY_QR' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex flex-col items-center">
                            <h3 className="font-bold text-sm md:text-base text-brand-navy mb-2">Scan QR Code</h3>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <img
                                src="/image.png"
                                alt="FonePay QR"
                                className="w-48 h-48 md:w-56 md:h-56 object-contain"
                              />
                            </div>
                            <p className="text-xs md:text-sm text-gray-600 mt-3 text-center">
                              Amount: <span className="font-bold">NPR {training.price.toLocaleString()}</span>
                            </p>
                          </div>
                        </div>
                      )}

                      {paymentData.paymentMethod === 'BANK_TRANSFER' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="font-bold text-sm md:text-base text-brand-navy mb-3">Bank Details</h3>
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
                      )}

                      {/* Payment Fields */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                          Amount (NPR) <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          value={paymentData.amount}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Training fee: NPR {training.price.toLocaleString()}</p>
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                          Transaction Reference (Optional)
                        </label>
                        <input
                          type="text"
                          value={paymentData.transactionReference}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, transactionReference: e.target.value }))}
                          className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
                          placeholder="e.g., FP20260201123456"
                        />
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                          Payment Remarks <span className="text-red-600">*</span>
                        </label>
                        <textarea
                          value={paymentData.remarks}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, remarks: e.target.value }))}
                          rows={3}
                          className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
                          placeholder={`Paid via ${paymentData.paymentMethod === 'FONE_PAY_QR' ? 'FonePay' : 'bank transfer'} on ${new Date().toISOString().split('T')[0]}`}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                          Payment Proof <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => setPaymentData(prev => ({ ...prev, proofFile: e.target.files?.[0] || null }))}
                          className="hidden"
                          id="payment-proof"
                          required
                        />
                        <label
                          htmlFor="payment-proof"
                          className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-blue hover:bg-blue-50 transition-all"
                        >
                          {paymentData.proofFile ? (
                            <div className="flex items-center gap-2 text-sm">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-green-600">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                              <span className="font-medium">{paymentData.proofFile.name}</span>
                            </div>
                          ) : (
                            <div className="text-center">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="size-8 text-gray-400 mx-auto mb-2">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                              </svg>
                              <p className="text-xs md:text-sm font-medium text-gray-700">Upload payment proof</p>
                              <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF - Max 5MB</p>
                            </div>
                          )}
                        </label>
                        {paymentData.proofFile && (
                          <button
                            type="button"
                            onClick={() => setPaymentData(prev => ({ ...prev, proofFile: null }))}
                            className="mt-2 text-xs text-red-600 hover:text-red-700"
                          >
                            Remove file
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin size-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Submit Enrollment & Payment'
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 order-1 lg:order-2">
                <div className="lg:sticky lg:top-24 space-y-4">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
                    <h3 className="text-base md:text-lg font-bold text-brand-navy mb-3 md:mb-4 font-heading">
                      Training Summary
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Training Name</p>
                        <p className="font-semibold text-sm md:text-base text-gray-900">{training.trainingName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Category</p>
                        <p className="font-semibold text-sm md:text-base text-gray-900">{training.trainingCategory}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Duration</p>
                        <p className="font-semibold text-sm md:text-base text-gray-900">{training.trainingHours} Hours</p>
                      </div>
                      <div className="pt-3 border-t">
                        <p className="text-xs text-gray-500 mb-1">Training Fee</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-gray-500 text-xs">NPR</span>
                          <span className="text-xl md:text-2xl font-bold text-brand-navy">
                            {training.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
                    <h3 className="text-base md:text-lg font-bold text-brand-navy mb-3 md:mb-4 font-heading">
                      Availability
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Seats Filled</span>
                        <span className="font-semibold">
                          {training.currentParticipants}/{training.maxParticipants}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-brand-blue h-2 rounded-full transition-all"
                          style={{ width: `${(training.currentParticipants / training.maxParticipants) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-bold text-brand-navy">{availableSeats}</span> seats remaining
                      </p>
                    </div>
                  </div>

                  {training.certificateProvided && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 text-green-600 shrink-0">
                          <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
                        </svg>
                        <span className="text-sm font-medium text-green-800">Certificate Provided</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
