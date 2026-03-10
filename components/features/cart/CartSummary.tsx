'use client'

import { useRouter } from 'next/navigation'
import type { CartSummary as CartSummaryType } from '@/types/cart.types'

interface CartSummaryProps {
  summary: CartSummaryType
  onCheckout: () => void
  isProcessing?: boolean
}

export function CartSummary({ summary, onCheckout, isProcessing = false }: CartSummaryProps) {
  const router = useRouter()

  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 lg:p-6 shadow-xl shadow-brand-navy/5 sticky top-20 sm:top-24">
      <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100 font-heading">
        Order Summary
      </h3>

      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        <div className="flex justify-between text-sm sm:text-base text-gray-600">
          <span>Original Price:</span>
          <span>{formatPrice(summary.subtotal)}</span>
        </div>
        
        {summary.discount > 0 && (
          <div className="flex justify-between text-sm sm:text-base text-gray-600">
            <span>Discount:</span>
            <span className="text-success">-{formatPrice(summary.discount)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm sm:text-base text-gray-600">
          <span>Tax / Processing:</span>
          <span>{formatPrice(summary.tax)}</span>
        </div>
        
        <div className="pt-3 sm:pt-4 border-t border-gray-100 flex justify-between items-end">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-widest">
              Total Amount
            </p>
            <p className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight font-heading">
              {formatPrice(summary.total)}
            </p>
          </div>
          <span className="text-[10px] font-bold text-gray-400 mb-1">NPR</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={isProcessing || summary.itemCount === 0}
        className="w-full bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-3 sm:py-4 rounded-xl shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2 text-base sm:text-lg mb-3 sm:mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>Proceed to Payment</span>
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>

      <p className="text-center text-[10px] sm:text-[11px] text-gray-400 leading-relaxed px-2 sm:px-4">
        By proceeding, you agree to the EntranceGateway{' '}
        <button onClick={() => router.push('/terms')} className="underline hover:text-brand-blue">
          Terms of Service
        </button>{' '}
        and{' '}
        <button onClick={() => router.push('/privacy')} className="underline hover:text-brand-blue">
          Privacy Policy
        </button>.
      </p>

      <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3 sm:gap-4">
        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">
          Secure Checkout
        </p>
        <div className="flex gap-3 sm:gap-4 opacity-40 grayscale">
          <span className="material-symbols-outlined text-xl sm:text-2xl">credit_card</span>
          <span className="material-symbols-outlined text-xl sm:text-2xl">account_balance</span>
          <span className="material-symbols-outlined text-xl sm:text-2xl">shield</span>
        </div>
      </div>
    </div>
  )
}
