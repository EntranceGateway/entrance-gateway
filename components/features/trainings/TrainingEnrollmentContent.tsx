'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchTrainingById, createEnrollment, submitTrainingPayment, checkEnrollmentStatus } from '@/services/client/trainings.client'
import { fetchUserProfile } from '@/services/client/user.client'
import { CenteredSpinner } from '@/components/shared/Loading'
import { useToast } from '@/components/shared/Toast'
import type { Training, TrainingDetailResponse } from '@/types/trainings.types'
import type { User } from '@/types/user.types'

interface TrainingEnrollmentContentProps {
  trainingId: string
  initialData?: TrainingDetailResponse | null
}

type EnrollmentStep = 'personal' | 'payment' | 'review'

type PaymentMethod = 'FONE_PAY_QR' | 'BANK_TRANSFER'

interface PaymentData {
  amount: number
  paymentMethod: PaymentMethod
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
  const [currentStep, setCurrentStep] = useState<EnrollmentStep>('personal')
  const [hasExistingEnrollment, setHasExistingEnrollment] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: 0,
    paymentMethod: 'FONE_PAY_QR',
    remarks: '',
    proofFile: null
  })

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [trainingResponse, userResponse, enrollmentStatus] = await Promise.all([
          initialData ? Promise.resolve(initialData) : fetchTrainingById(trainingId),
          fetchUserProfile(),
          checkEnrollmentStatus(parseInt(trainingId))
        ])

        setTraining(trainingResponse.data)
        setUserData(userResponse.data)
        
        // Set initial payment amount to training price
        setPaymentData(prev => ({
          ...prev,
          amount: trainingResponse.data.price
        }))

        // Check if user has existing enrollment
        if (enrollmentStatus && enrollmentStatus.data) {
          const status = enrollmentStatus.data.status
          
          // If enrollment exists and is payment pending, skip to payment step
          if (status === 'PAYMENT_PENDING') {
            console.log('✅ Existing enrollment found (PAYMENT_PENDING) - skipping to payment step')
            setHasExistingEnrollment(true)
            setCurrentStep('payment')
            showToast('You have a pending enrollment. Please complete payment within 24 hours.', 'info')
          } else if (status === 'CONFIRMED' || status === 'COMPLETED') {
            // Already enrolled and paid
            console.log('✅ User already enrolled and confirmed')
            showToast('You are already enrolled in this training.', 'info')
            // Redirect back to training detail after 2 seconds
            setTimeout(() => {
              router.push(`/trainings/${trainingId}`)
            }, 2000)
          } else if (status === 'EXPIRED') {
            // Enrollment expired, allow re-enrollment
            console.log('⚠️ Previous enrollment expired - allowing new enrollment')
            setHasExistingEnrollment(false)
            setCurrentStep('personal')
          } else if (status === 'CANCELLED') {
            // Enrollment cancelled, allow re-enrollment
            console.log('⚠️ Previous enrollment cancelled - allowing new enrollment')
            setHasExistingEnrollment(false)
            setCurrentStep('personal')
          }
        } else {
          // No existing enrollment
          console.log('ℹ️ No existing enrollment - starting from personal detail')
          setHasExistingEnrollment(false)
          setCurrentStep('personal')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
        console.error('Error loading enrollment data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [trainingId, initialData, router, showToast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!training || !userData) return

    // Step 1: Personal Detail - Create initial enrollment (only if no existing enrollment)
    if (currentStep === 'personal') {
      // Skip enrollment creation if already exists
      if (hasExistingEnrollment) {
        setCurrentStep('payment')
        return
      }

      setIsSubmitting(true)
      
      try {
        // Call initial enrollment API
        const response = await createEnrollment(training.trainingId)
        
        console.log('✅ Initial enrollment created:', response)
        
        // Mark that enrollment now exists
        setHasExistingEnrollment(true)
        
        // Show success toast
        showToast('Enrollment initiated successfully! Please proceed with payment.', 'success')
        
        // Move to payment step
        setCurrentStep('payment')
      } catch (err) {
        console.error('❌ Initial enrollment error:', err)
        const errorMessage = err instanceof Error ? err.message : 'Failed to create enrollment. Please try again.'
        
        // Check if error is due to duplicate enrollment
        if (errorMessage.includes('already enrolled') || errorMessage.includes('duplicate')) {
          showToast('You already have a pending enrollment. Proceeding to payment.', 'info')
          setHasExistingEnrollment(true)
          setCurrentStep('payment')
        } else {
          showToast(errorMessage, 'error')
        }
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    // Step 2: Payment - Submit payment and move to review
    if (currentStep === 'payment') {
      // Validate payment data
      if (!paymentData.amount || paymentData.amount <= 0) {
        showToast('Please enter a valid payment amount', 'error')
        return
      }
      if (!paymentData.remarks.trim()) {
        showToast('Please enter payment remarks', 'error')
        return
      }
      if (!paymentData.proofFile) {
        showToast('Please upload payment proof (screenshot/receipt)', 'error')
        return
      }

      setIsSubmitting(true)

      try {
        // Submit payment with proof
        const response = await submitTrainingPayment(training.trainingId, {
          amount: paymentData.amount,
          paymentMethod: paymentData.paymentMethod,
          remarks: paymentData.remarks,
          proofFile: paymentData.proofFile
        })
        
        console.log('✅ Payment submitted successfully:', response)
        
        showToast('Payment submitted successfully!', 'success')

        // Move to review step to show confirmation
        setCurrentStep('review')
      } catch (err) {
        console.error('❌ Payment submission error:', err)
        showToast(
          err instanceof Error ? err.message : 'Payment submission failed. Please try again.',
          'error'
        )
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    // Step 3: Review - Just redirect (payment already submitted)
    if (currentStep === 'review') {
      // Redirect to training detail page
      router.push(`/trainings/${trainingId}`)
    }
  }

  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('personal')
    } else if (currentStep === 'review') {
      setCurrentStep('payment')
    }
  }

  const getStepNumber = (step: EnrollmentStep): number => {
    const steps: EnrollmentStep[] = ['personal', 'payment', 'review']
    return steps.indexOf(step) + 1
  }

  const isStepComplete = (step: EnrollmentStep): boolean => {
    return getStepNumber(step) < getStepNumber(currentStep)
  }

  const isStepActive = (step: EnrollmentStep): boolean => {
    return step === currentStep
  }

  // Loading State
  if (isLoading) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <CenteredSpinner size="lg" text="Loading enrollment form..." />
        </div>
      </main>
    )
  }

  // Error State
  if (error || !training || !userData) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-semantic-error/10 border border-semantic-error text-semantic-error p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <div>
                <h3 className="font-bold text-lg mb-1">Unable to load enrollment form</h3>
                <p className="text-sm">{error || 'Please try again later'}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href={`/trainings/${trainingId}`}
                className="text-sm font-medium hover:underline"
              >
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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/trainings/${trainingId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-brand-navy mb-4 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back to training details
          </Link>
          
          <h1 className="text-3xl font-bold text-brand-navy font-heading mb-2">
            Training Enrollment
          </h1>
          <p className="text-gray-600">
            Complete your enrollment for <span className="font-semibold">{training.trainingName}</span>
          </p>
        </div>

        {/* CRITICAL WARNINGS / ALERTS - Full Width Banner */}
        <div className="mb-6 space-y-3">
          {/* Warning 1: Verify Information - Orange/Amber (High Attention) */}
          <div className="relative bg-amber-50 border-l-4 border-amber-500 rounded-r-md p-3 shadow-sm overflow-hidden">
            {/* Animated stripe pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-shimmer" />
            </div>
            
            <div className="relative flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="size-8 rounded-full bg-amber-500 flex items-center justify-center shadow-md ring-2 ring-amber-100">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-white animate-bounce-slow">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide mb-1">
                  ⚠️ Action Required: Verify Your Information
                </h3>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Please <span className="font-bold bg-amber-200 px-1 py-0.5 rounded">carefully review</span> all your details. 
                  Update incorrect information in your{' '}
                  <Link href="/profile" className="text-amber-700 hover:text-amber-900 font-bold underline decoration-2">
                    profile settings
                  </Link>
                  {' '}before submitting.
                </p>
              </div>
            </div>
          </div>

          {/* Warning 2: Payment Deadline - Red (Urgency & Danger) */}
          <div className="relative bg-red-50 border-l-4 border-red-600 rounded-r-md p-3 shadow-sm overflow-hidden">
            {/* Animated stripe pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-red-500 to-transparent animate-shimmer" />
            </div>
            
            <div className="relative flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="size-8 rounded-full bg-red-600 flex items-center justify-center shadow-md ring-2 ring-red-100 animate-pulse">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-white">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-red-900 uppercase tracking-wide mb-1">
                  🚨 Time Sensitive: Payment Deadline
                </h3>
                <p className="text-xs text-red-900 leading-relaxed">
                  Your enrollment will <span className="font-bold bg-red-200 px-1 py-0.5 rounded">automatically expire</span> if payment is not completed within{' '}
                  <span className="inline-flex items-center bg-red-600 text-white font-bold px-2 py-0.5 rounded shadow-sm text-xs">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-3 mr-1">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                    24 HOURS
                  </span>{' '}
                  of submission.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Stepper */}
        <div className="mb-8 bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
            {/* Step 1: Personal Detail */}
            <div className="flex-1 flex items-center w-full md:w-auto">
              <div className={`flex items-center justify-center size-8 md:size-10 rounded-full font-bold text-sm md:text-base transition-all ${
                isStepComplete('personal') ? 'bg-brand-blue text-white shadow-md' :
                isStepActive('personal') ? 'bg-brand-blue text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {isStepComplete('personal') ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 md:size-6">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                ) : '1'}
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-xs md:text-sm font-bold transition-colors ${
                  isStepComplete('personal') || isStepActive('personal') ? 'text-brand-navy' : 'text-gray-600'
                }`}>
                  Personal Detail
                </p>
                <p className="text-xs text-gray-500 hidden sm:block">Verify your information</p>
              </div>
            </div>

            {/* Connector Line 1->2 */}
            <div className={`hidden md:block flex-1 h-1 mx-4 transition-all ${
              isStepComplete('personal') ? 'bg-brand-blue' : 'bg-gray-200'
            }`} />
            <div className={`md:hidden w-0.5 h-8 ml-4 transition-all ${
              isStepComplete('personal') ? 'bg-brand-blue' : 'bg-gray-200'
            }`} />

            {/* Step 2: Payment */}
            <div className="flex-1 flex items-center w-full md:w-auto">
              <div className={`flex items-center justify-center size-8 md:size-10 rounded-full font-bold text-sm md:text-base transition-all ${
                isStepComplete('payment') ? 'bg-brand-blue text-white shadow-md' :
                isStepActive('payment') ? 'bg-brand-blue text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {isStepComplete('payment') ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 md:size-6">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                ) : '2'}
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-xs md:text-sm font-bold transition-colors ${
                  isStepComplete('payment') || isStepActive('payment') ? 'text-brand-navy' : 'text-gray-600'
                }`}>
                  Payment
                </p>
                <p className="text-xs text-gray-500 hidden sm:block">Payment instructions</p>
              </div>
            </div>

            {/* Connector Line 2->3 */}
            <div className={`hidden md:block flex-1 h-1 mx-4 transition-all ${
              isStepComplete('payment') ? 'bg-brand-blue' : 'bg-gray-200'
            }`} />
            <div className={`md:hidden w-0.5 h-8 ml-4 transition-all ${
              isStepComplete('payment') ? 'bg-brand-blue' : 'bg-gray-200'
            }`} />

            {/* Step 3: Review */}
            <div className="flex-1 flex items-center w-full md:w-auto">
              <div className={`flex items-center justify-center size-8 md:size-10 rounded-full font-bold text-sm md:text-base transition-all ${
                isStepActive('review') ? 'bg-brand-blue text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-xs md:text-sm font-bold transition-colors ${
                  isStepActive('review') ? 'text-brand-navy' : 'text-gray-600'
                }`}>
                  Review
                </p>
                <p className="text-xs text-gray-500 hidden sm:block">Confirm enrollment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Form Content - Shows second on mobile */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 md:p-8">
              {/* Step 1: Personal Detail */}
              {currentStep === 'personal' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-brand-navy mb-4 font-heading">
                      Personal Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={userData.fullname}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={userData.email}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                        <input
                          type="tel"
                          value={userData.contact}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={userData.address}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      To update your information, visit your{' '}
                      <Link href="/profile" className="text-brand-blue hover:underline">profile page</Link>.
                    </p>
                  </div>

                  <div className="pt-4 md:pt-6 border-t border-gray-200">
                    <h3 className="text-base md:text-lg font-bold text-brand-navy mb-4">Educational Background</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Latest Qualification</label>
                        <input
                          type="text"
                          value={userData.latestQualification}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Area of Interest</label>
                        <input
                          type="text"
                          value={userData.interested}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 md:pt-6 flex flex-col sm:flex-row justify-end gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-brand-gold hover:bg-[#EBB000] text-white font-bold py-3 px-6 md:px-8 rounded-lg shadow-md transition-all uppercase tracking-wide text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin size-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Creating Enrollment...
                        </>
                      ) : (
                        'Enroll & Continue to Payment'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 'payment' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-brand-navy mb-4 font-heading">
                      Payment Information
                    </h2>
                    
                    {/* Payment Method Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Payment Method
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        {/* FonePay Option */}
                        <button
                          type="button"
                          onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'FONE_PAY_QR' }))}
                          className={`relative p-4 border-2 rounded-lg transition-all ${
                            paymentData.paymentMethod === 'FONE_PAY_QR'
                              ? 'border-brand-blue bg-brand-blue/5 ring-2 ring-brand-blue/20'
                              : 'border-gray-300 hover:border-brand-blue/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                              paymentData.paymentMethod === 'FONE_PAY_QR'
                                ? 'border-brand-blue'
                                : 'border-gray-300'
                            }`}>
                              {paymentData.paymentMethod === 'FONE_PAY_QR' && (
                                <div className="size-3 rounded-full bg-brand-blue" />
                              )}
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-900">FonePay QR</p>
                              <p className="text-xs text-gray-500">Scan QR code to pay</p>
                            </div>
                          </div>
                        </button>

                        {/* Bank Transfer Option */}
                        <button
                          type="button"
                          onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'BANK_TRANSFER' }))}
                          className={`relative p-4 border-2 rounded-lg transition-all ${
                            paymentData.paymentMethod === 'BANK_TRANSFER'
                              ? 'border-brand-blue bg-brand-blue/5 ring-2 ring-brand-blue/20'
                              : 'border-gray-300 hover:border-brand-blue/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                              paymentData.paymentMethod === 'BANK_TRANSFER'
                                ? 'border-brand-blue'
                                : 'border-gray-300'
                            }`}>
                              {paymentData.paymentMethod === 'BANK_TRANSFER' && (
                                <div className="size-3 rounded-full bg-brand-blue" />
                              )}
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-gray-900">Bank Transfer</p>
                              <p className="text-xs text-gray-500">Direct bank deposit</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* FonePay QR Code */}
                    {paymentData.paymentMethod === 'FONE_PAY_QR' && (
                      <div className="bg-gradient-to-br from-brand-blue/5 to-brand-blue/10 border border-brand-blue/20 rounded-lg p-4 md:p-6">
                        <div className="flex flex-col items-center">
                          <h3 className="font-bold text-brand-navy mb-2 text-sm md:text-base">Scan QR Code to Pay</h3>
                          <p className="text-xs md:text-sm text-gray-600 mb-4 text-center">
                            Open your FonePay app and scan this QR code
                          </p>
                          <div className="bg-white p-3 md:p-4 rounded-lg shadow-md">
                            <img
                              src="/image.png"
                              alt="FonePay QR Code"
                              className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain"
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="256" height="256"%3E%3Crect width="256" height="256" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="16" fill="%236b7280"%3EQR Code%3C/text%3E%3C/svg%3E'
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-4">
                            Amount: <span className="font-bold text-brand-navy">NPR {training.price.toLocaleString()}</span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Bank Transfer Details */}
                    {paymentData.paymentMethod === 'BANK_TRANSFER' && (
                      <div className="bg-gradient-to-br from-brand-blue/5 to-brand-blue/10 border border-brand-blue/20 rounded-lg p-4 md:p-6">
                        <h3 className="font-bold text-brand-navy mb-4 text-sm md:text-base">Bank Transfer Details</h3>
                        <div className="space-y-2 md:space-y-3 bg-white rounded-lg p-3 md:p-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 gap-1">
                            <span className="text-xs md:text-sm text-gray-600">Account Number:</span>
                            <span className="font-mono font-bold text-gray-900 text-sm md:text-base">34201010000602</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 gap-1">
                            <span className="text-xs md:text-sm text-gray-600">Account Name:</span>
                            <span className="font-semibold text-gray-900 text-xs md:text-sm">Samasta Groups Private Limited</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 gap-1">
                            <span className="text-xs md:text-sm text-gray-600">Bank:</span>
                            <span className="font-semibold text-gray-900 text-sm md:text-base">Global IME</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-1">
                            <span className="text-xs md:text-sm text-gray-600">Branch:</span>
                            <span className="font-semibold text-gray-900 text-sm md:text-base">Ekantakuna</span>
                          </div>
                        </div>
                        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <p className="text-xs text-amber-900">
                            <span className="font-bold">Note:</span> Please use your enrollment ID or name as reference when making the transfer.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Payment Form Fields */}
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Amount (NPR) <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          value={paymentData.amount}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                          placeholder="Enter amount"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Training fee: NPR {training.price.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Remarks <span className="text-red-600">*</span>
                        </label>
                        <textarea
                          value={paymentData.remarks}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, remarks: e.target.value }))}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                          placeholder={`e.g., Paid via ${paymentData.paymentMethod === 'FONE_PAY_QR' ? 'FonePay' : 'bank transfer'} on ${new Date().toISOString().split('T')[0]}`}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Include transaction ID, date, or any reference information
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Proof <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null
                              setPaymentData(prev => ({ ...prev, proofFile: file }))
                            }}
                            className="hidden"
                            id="payment-proof-upload"
                          />
                          <label
                            htmlFor="payment-proof-upload"
                            className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-blue hover:bg-brand-blue/5 transition-all"
                          >
                            <div className="text-center">
                              {paymentData.proofFile ? (
                                <div className="flex items-center gap-2">
                                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-semantic-success">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                  </svg>
                                  <span className="text-sm font-medium text-gray-900">
                                    {paymentData.proofFile.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({(paymentData.proofFile.size / 1024).toFixed(1)} KB)
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-8 text-gray-400">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                  </svg>
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">
                                      Click to upload payment proof
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Screenshot or receipt (PNG, JPG, PDF - Max 5MB)
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </label>
                        </div>
                        {paymentData.proofFile && (
                          <button
                            type="button"
                            onClick={() => setPaymentData(prev => ({ ...prev, proofFile: null }))}
                            className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            Remove file
                          </button>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Upload a screenshot of your payment confirmation or bank receipt
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-semantic-warning/10 border border-semantic-warning/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-semantic-warning shrink-0 mt-0.5">
                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                      </svg>
                      <div>
                        <p className="text-sm font-bold text-semantic-warning mb-1">Important Reminder</p>
                        <p className="text-sm text-gray-700">
                          Your enrollment will be automatically cancelled if payment is not received within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 md:pt-6 flex justify-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-brand-gold hover:bg-[#EBB000] text-white font-bold py-3 px-6 md:px-8 rounded-lg shadow-md transition-all uppercase tracking-wide text-sm md:text-base order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin size-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing Payment...
                        </>
                      ) : (
                        'Pay & Continue to Review'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 'review' && (
                <div className="space-y-6">
                  {/* Success Message */}
                  <div className="bg-semantic-success/10 border-l-4 border-semantic-success rounded-r-lg p-6 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="size-12 rounded-full bg-semantic-success flex items-center justify-center">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="size-7 text-white">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-semantic-success mb-2">
                          Payment Submitted Successfully!
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Your payment has been submitted and is being processed. You will receive a confirmation email shortly with your enrollment details.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-brand-navy mb-4 font-heading">
                      Enrollment Summary
                    </h2>
                    
                    {/* Personal Info Summary */}
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-900 mb-3">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Name:</span>
                          <span className="ml-2 font-medium">{userData.fullname}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <span className="ml-2 font-medium">{userData.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Contact:</span>
                          <span className="ml-2 font-medium">{userData.contact}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Address:</span>
                          <span className="ml-2 font-medium">{userData.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Training Summary */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <h3 className="text-sm font-bold text-gray-900 mb-3">Training Details</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Training:</span>
                          <span className="ml-2 font-medium">{training.trainingName}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <span className="ml-2 font-medium">{training.trainingCategory}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <span className="ml-2 font-medium">{training.trainingHours} Hours</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Fee:</span>
                          <span className="ml-2 font-medium">NPR {training.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-900 mb-3">Payment Information</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Payment Method:</span>
                          <span className="font-medium">{paymentData.paymentMethod === 'FONE_PAY_QR' ? 'FonePay QR' : 'Bank Transfer'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Amount:</span>
                          <span className="font-medium">NPR {paymentData.amount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Remarks:</span>
                          <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded text-xs">{paymentData.remarks}</p>
                        </div>
                        {paymentData.proofFile && (
                          <div>
                            <span className="text-gray-500">Payment Proof:</span>
                            <div className="mt-1 flex items-center gap-2 bg-gray-50 p-2 rounded">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-semantic-success">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                              <span className="text-xs font-medium">{paymentData.proofFile.name}</span>
                              <span className="text-xs text-gray-500">({(paymentData.proofFile.size / 1024).toFixed(1)} KB)</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 md:pt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 md:px-8 rounded-lg hover:bg-gray-50 transition-all text-sm md:text-base order-2 sm:order-1"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-brand-gold hover:bg-[#EBB000] text-brand-navy font-bold py-3 px-8 md:px-12 rounded-lg shadow-md transition-all uppercase tracking-wide text-sm md:text-base flex items-center justify-center gap-2"
                    >
                      <span>Back to Training Details</span>
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Column - Personal Summary (Supporting) - Shows first on mobile */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Training Summary - Hidden on payment step */}
              {currentStep !== 'payment' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-brand-navy mb-4 font-heading">
                    Training Summary
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Training Name</p>
                      <p className="font-semibold text-gray-900">{training.trainingName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Category</p>
                      <p className="font-semibold text-gray-900">{training.trainingCategory}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Duration</p>
                      <p className="font-semibold text-gray-900">{training.trainingHours} Hours</p>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">Training Fee</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-gray-500 text-sm">NPR</span>
                        <span className="text-2xl font-bold text-brand-navy">
                          {training.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Completion Stats / Availability - Hidden on payment step */}
              {currentStep !== 'payment' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-brand-navy mb-4 font-heading">
                    Availability
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Seats Filled</span>
                      <span className="font-semibold text-gray-900">
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
              )}

              {/* Payment Status / Deadline - Hidden on payment step */}
              {currentStep !== 'payment' && (
                <div className="relative bg-red-50 border-l-4 border-red-600 rounded-r-md p-3 shadow-sm overflow-hidden">
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-red-500 to-transparent animate-shimmer" />
                  </div>
                  
                  <div className="relative flex items-start gap-2">
                    <div className="flex-shrink-0">
                      <div className="size-7 rounded-full bg-red-600 flex items-center justify-center shadow-sm ring-2 ring-red-100 animate-pulse">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-white">
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-red-900 mb-1 uppercase tracking-wide">🚨 Payment Deadline</p>
                      <p className="text-xs text-red-900 leading-relaxed">
                        Complete payment within{' '}
                        <span className="inline-flex items-center bg-red-600 text-white font-bold px-1.5 py-0.5 rounded text-xs">
                          24 HOURS
                        </span>{' '}
                        after enrollment
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Certificate Badge - Hidden on payment step */}
              {currentStep !== 'payment' && training.certificateProvided && (
                <div className="bg-semantic-success/10 border border-semantic-success/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 text-semantic-success">
                      <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
                    </svg>
                    <span className="text-sm font-medium text-semantic-success">
                      Certificate Provided
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
