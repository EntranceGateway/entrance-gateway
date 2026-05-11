'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export function PaymentStatusBanner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  const paymentStatus = searchParams.get('payment')
  const reason = searchParams.get('reason')

  useEffect(() => {
    if (paymentStatus) {
      setVisible(true)
    }
  }, [paymentStatus])

  function dismiss() {
    setVisible(false)
    // Clean up query params from URL
    const url = new URL(window.location.href)
    url.searchParams.delete('payment')
    url.searchParams.delete('reason')
    router.replace(url.pathname, { scroll: false })
  }

  if (!visible || !paymentStatus) return null

  const isSuccess = paymentStatus === 'success'

  const reasonMessages: Record<string, string> = {
    verification_failed: 'Payment was received but verification failed. Please contact support if the amount was debited.',
    timeout: 'Payment verification timed out. If your amount was debited, it will be refunded or verified within 24 hours.',
    cancelled: 'Payment was cancelled. No amount was charged.',
    unknown: 'An unexpected error occurred during payment processing.',
  }

  const reasonText = reason ? reasonMessages[reason] || `Reason: ${reason}` : undefined

  return (
    <div
      className={`mb-6 flex items-start gap-3 rounded-2xl border px-5 py-4 ${
        isSuccess
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-red-200 bg-red-50'
      }`}
    >
      <span
        className={`material-symbols-outlined mt-0.5 text-xl ${
          isSuccess ? 'text-emerald-500' : 'text-red-500'
        }`}
      >
        {isSuccess ? 'check_circle' : 'error'}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-black ${
            isSuccess ? 'text-emerald-800' : 'text-red-800'
          }`}
        >
          {isSuccess
            ? 'Payment successful! Your subscription has been activated.'
            : 'Payment was not completed'}
        </p>
        {reasonText && (
          <p className="mt-1 text-sm leading-6 text-gray-600">{reasonText}</p>
        )}
        {!isSuccess && (
          <p className="mt-2 text-xs text-gray-500">
            You can try again or use manual payment as an alternative.
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        aria-label="Dismiss"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  )
}
