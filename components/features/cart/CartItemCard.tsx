'use client'

import type { CartItem } from '@/types/cart.types'

interface CartItemCardProps {
  item: CartItem
  onRemove: (id: number) => void
  onSaveForLater: (id: number) => void
}

export function CartItemCard({ item, onRemove, onSaveForLater }: CartItemCardProps) {
  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getCategoryBadge = () => {
    const colors = {
      QUIZ: 'bg-brand-navy/5 text-brand-navy',
      TRAINING: 'bg-brand-blue/5 text-brand-blue',
      COURSE: 'bg-brand-purple/5 text-brand-purple',
    }
    return colors[item.type] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 sm:gap-6 items-start hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-full md:w-32 lg:w-40 h-24 sm:h-28 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/10 to-brand-blue/20" />
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-brand-blue text-3xl sm:text-4xl opacity-40">
              {item.type === 'QUIZ' ? 'quiz' : item.type === 'TRAINING' ? 'school' : 'menu_book'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-3 sm:gap-4 mb-2">
          <div className="flex-1 min-w-0">
            <span className={`inline-block px-2 py-0.5 rounded ${getCategoryBadge()} text-[10px] font-bold uppercase tracking-wider mb-2`}>
              {item.category}
            </span>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-brand-navy leading-snug font-heading truncate">
              {item.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
              {item.description}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            {item.originalPrice && item.originalPrice > item.price && (
              <p className="text-[10px] sm:text-xs text-gray-400 line-through">
                {formatPrice(item.originalPrice)}
              </p>
            )}
            <p className="text-base sm:text-lg lg:text-xl font-bold text-brand-navy">
              {formatPrice(item.price)}
            </p>
          </div>
        </div>

        {/* Metadata */}
        {(item.metadata.questions || item.metadata.duration) && (
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-gray-600 mb-3">
            {item.metadata.questions && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs sm:text-sm">quiz</span>
                <span>{item.metadata.questions} Questions</span>
              </div>
            )}
            {item.metadata.duration && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs sm:text-sm">schedule</span>
                <span>{item.metadata.duration} Minutes</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => onRemove(item.id)}
            className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
          >
            <span className="material-symbols-outlined text-xs sm:text-sm">delete</span>
            <span>Remove</span>
          </button>
          <button
            onClick={() => onSaveForLater(item.id)}
            className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-gray-400 hover:text-brand-blue transition-colors"
          >
            <span className="material-symbols-outlined text-xs sm:text-sm">favorite</span>
            <span>Save for later</span>
          </button>
        </div>
      </div>
    </div>
  )
}
