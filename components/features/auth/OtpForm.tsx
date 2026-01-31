'use client'

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { verifyOtp, resendOtp, getPendingEmail, clearPendingEmail } from '@/lib/auth/client'
import { Spinner } from '@/components/shared/Loading'
import { useToast } from '@/components/shared/Toast'

const OTP_EXPIRY_SECONDS = 180 // 3 minutes
const RESEND_COOLDOWN_SECONDS = 59

export function OtpForm() {
  const router = useRouter()
  const { success, error: showError, warning } = useToast()
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [otpExpiry, setOtpExpiry] = useState(OTP_EXPIRY_SECONDS)
  const [resendCountdown, setResendCountdown] = useState(RESEND_COOLDOWN_SECONDS)
  const [email, setEmail] = useState<string>('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Get email from localStorage on mount
  useEffect(() => {
    const pendingEmail = getPendingEmail()
    if (!pendingEmail) {
      // No pending email, redirect to signup
      router.push('/signup')
      return
    }
    setEmail(pendingEmail)
  }, [router])

  // OTP expiry countdown
  useEffect(() => {
    if (otpExpiry <= 0) return

    const interval = setInterval(() => {
      setOtpExpiry((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [otpExpiry])

  // Resend countdown
  useEffect(() => {
    if (resendCountdown <= 0) return

    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [resendCountdown])

  // Handle input change
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle keydown for backspace
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').trim()
    
    // Only process if it's 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      // Focus last input
      inputRefs.current[5]?.focus()
    }
  }

  // Handle verify
  const handleVerify = async () => {
    const otpValue = otp.join('')
    
    if (otpValue.length !== 6) {
      showError('Please enter all 6 digits')
      triggerShakeAnimation()
      return
    }

    if (otpExpiry <= 0) {
      showError('OTP has expired. Please request a new code.')
      triggerShakeAnimation()
      return
    }

    setIsVerifying(true)

    try {
      await verifyOtp(email, otpValue)

      // Clear pending email
      clearPendingEmail()
      
      success('Email verified successfully! Please sign in to continue.')
      
      // Navigate to login page
      router.push('/signin')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid code. Please try again.'
      showError(errorMessage)
      triggerShakeAnimation()
    } finally {
      setIsVerifying(false)
    }
  }

  // Handle resend
  const handleResend = async () => {
    if (isResending || resendCountdown > 0) return

    setIsResending(true)
    setOtp(['', '', '', '', '', ''])
    
    try {
      await resendOtp(email)
      
      // Reset timers
      setOtpExpiry(OTP_EXPIRY_SECONDS)
      setResendCountdown(RESEND_COOLDOWN_SECONDS)
      
      success('New OTP sent successfully! Please check your email.')
      
      // Focus first input
      inputRefs.current[0]?.focus()
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to resend OTP. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  // Trigger shake animation
  const triggerShakeAnimation = () => {
    const container = document.getElementById('otp-container')
    if (container) {
      container.classList.add('animate-shake')
      setTimeout(() => {
        container.classList.remove('animate-shake')
      }, 500)
    }
  }

  // Format countdown
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Check if OTP is about to expire (last 60 seconds)
  const isAboutToExpire = otpExpiry > 0 && otpExpiry <= 60
  const isExpired = otpExpiry <= 0

  return (
    <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
      {/* OTP Expiry Timer */}
      <div className="text-center">
        <p className={`text-sm font-medium ${
          isExpired 
            ? 'text-semantic-error' 
            : isAboutToExpire 
            ? 'text-semantic-warning' 
            : 'text-gray-600'
        }`}>
          {isExpired ? (
            <>
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 inline mr-1">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              Code Expired
            </>
          ) : (
            <>
              Code expires in: <span className="font-mono font-bold">{formatCountdown(otpExpiry)}</span>
            </>
          )}
        </p>
      </div>

      {/* OTP Input Fields */}
      <div id="otp-container">
        <div className="flex justify-between gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              autoFocus={index === 0}
              disabled={isExpired}
              className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold text-brand-navy border-2 rounded-lg shadow-sm focus:ring-0 focus:outline-none transition-colors placeholder-transparent ${
                isExpired
                  ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                  : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-blue'
              }`}
              placeholder="-"
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        {/* Verify Button */}
        <button
          type="submit"
          disabled={isVerifying || isExpired}
          className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-brand-navy bg-brand-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold transition-colors duration-200 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifying ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Verifying...
            </>
          ) : isExpired ? (
            'Code Expired'
          ) : (
            'Verify Account'
          )}
        </button>

        {/* Resend Section */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || resendCountdown > 0}
              className="font-medium text-brand-blue hover:text-brand-navy transition-colors ml-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <>
                  <Spinner size="sm" className="inline mr-1" />
                  Sending...
                </>
              ) : (
                'Request New Code'
              )}
            </button>
          </p>
          {resendCountdown > 0 && (
            <p className="text-xs text-gray-400 mt-1 font-mono">
              Resend in {formatCountdown(resendCountdown)}
            </p>
          )}
        </div>
      </div>

      {/* Add shake animation styles */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </form>
  )
}
