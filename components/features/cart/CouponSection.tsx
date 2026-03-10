'use client'

import { useState } from 'react'

interface CouponSectionProps {
  onApplyCoupon: (code: string) => Promise<void>
}

export function CouponSection({ onApplyCoupon }: CouponSectionProps) {
  const [couponCode, setCouponCode] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleApply = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code')
      return
    }

    setIsApplying(true)
    setError(null)
    setSuccess(null)

    try {
      await onApplyCoupon(couponCode)
      setSuccess('Coupon applied successfully!')
      setCouponCode('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid coupon code')
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="mt-8 p-6 bg-brand-blue/5 border border-dashed border-brand-blue/30 rounded-xl">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-brand-blue text-3xl flex-shrink-0">
            redeem
          </span>
          <div>
            <p className="font-bold text-brand-navy">Have a referral or coupon code?</p>
            <p className="text-sm text-gray-500">
              Apply it to your total for additional savings.
            </p>
          </div>
        </div>
        
        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value.toUpperCase())
              setError(null)
              setSuccess(null)
            }}
            placeholder="CODE2024"
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all"
            disabled={isApplying}
          />
          <button
            onClick={handleApply}
            disabled={isApplying || !couponCode.trim()}
            className="bg-brand-blue hover:bg-brand-navy text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isApplying ? 'Applying...' : 'Apply'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-success">{success}</p>
        </div>
      )}
    </div>
  )
}
