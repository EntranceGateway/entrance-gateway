'use client'

import Link from 'next/link'
import type { CartItem } from '@/types/cart.types'

interface CartItemCardProps {
  item: CartItem
  onRemove: (quizId: number) => void
}

export function CartItemCard({ item, onRemove }: CartItemCardProps) {
  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 sm:gap-6 items-start hover:shadow-md transition-shadow">
      {/* Image Placeholder */}
      <div className="w-full md:w-32 lg:w-40 h-24 sm:h-28 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/10 to-brand-blue/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-10 sm:size-12 text-brand-blue opacity-40">
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-3 sm:gap-4 mb-2">
          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-wider mb-2">
              {item.courseName || 'Quiz'}
            </span>
            <Link 
              href={`/quiz/${item.quizSlug}`}
              className="block hover:text-brand-blue transition-colors"
            >
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-brand-navy leading-snug font-heading">
                {item.quizName}
              </h3>
            </Link>
          </div>
          <div className="text-right flex-shrink-0">
            {item.priceChanged && (
              <p className="text-[10px] sm:text-xs text-gray-400 line-through">
                {formatPrice(item.priceAtAddition)}
              </p>
            )}
            <p className="text-base sm:text-lg lg:text-xl font-bold text-brand-navy">
              {formatPrice(item.currentPrice)}
            </p>
            {item.priceChanged && (
              <p className="text-[9px] sm:text-[10px] text-amber-600 font-semibold mt-0.5">
                Price changed
              </p>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 sm:size-4">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
            <span>{item.nosOfQuestions} Questions</span>
          </div>
          <div className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 sm:size-4">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
            <span>{item.durationInMinutes} Minutes</span>
          </div>
        </div>

        {/* Added Date */}
        <p className="text-[10px] sm:text-xs text-gray-400 mb-3">
          Added on {new Date(item.addedAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => onRemove(item.quizId)}
            className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 sm:size-4">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  )
}
