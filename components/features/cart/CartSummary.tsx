'use client'

import { useRouter } from 'next/navigation'

interface CartSummaryProps {
  totalItems: number
  totalPrice: number
  onCheckout: () => void
}

export function CartSummary({ totalItems, totalPrice, onCheckout }: CartSummaryProps) {
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
          <span>Items ({totalItems}):</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        
        <div className="pt-3 sm:pt-4 border-t border-gray-100 flex justify-between items-end">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-widest">
              Total Amount
            </p>
            <p className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight font-heading">
              {formatPrice(totalPrice)}
            </p>
          </div>
          <span className="text-[10px] font-bold text-gray-400 mb-1">NPR</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={totalItems === 0}
        className="w-full bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-3 sm:py-4 rounded-xl shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2 text-base sm:text-lg mb-3 sm:mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>Proceed to Payment</span>
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
        </svg>
      </button>

      <p className="text-center text-[10px] sm:text-[11px] text-gray-400 leading-relaxed px-2 sm:px-4">
        By proceeding, you agree to the EntranceGateway{' '}
        <button onClick={() => router.push('/terms')} className="underline hover:text-brand-blue cursor-pointer">
          Terms of Service
        </button>{' '}
        and{' '}
        <button onClick={() => router.push('/privacy')} className="underline hover:text-brand-blue cursor-pointer">
          Privacy Policy
        </button>.
      </p>

      <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3 sm:gap-4">
        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">
          Secure Checkout
        </p>
        <div className="flex gap-3 sm:gap-4 opacity-40 grayscale">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
          </svg>
        </div>
      </div>
    </div>
  )
}
