import type { Quiz } from '@/types/quiz.types'

interface QuizCardProps {
  item: Quiz
  onClick?: () => void
  onAddToCart?: (quiz: Quiz) => void
}

export function QuizCard({ item, onClick, onAddToCart }: QuizCardProps) {
  // Format price
  const formatPrice = (price?: number) => {
    return `NPR ${(price ?? 0).toLocaleString()}`
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart?.(item)
  }

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Content */}
      <div className="p-6 flex-grow">
        {/* Header: Status Badge and Category */}
        <div className="flex justify-between items-start mb-4">
          <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            AVAILABLE
          </span>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {item.courseName}
          </span>
        </div>

        {/* Quiz Title */}
        <h3 className="text-xl font-bold text-brand-navy mb-4 leading-tight">
          {item.setName}
        </h3>

        {/* Quiz Details Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6 py-4 border-y border-gray-100">
          <div className="text-center">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Questions</div>
            <div className="text-xs font-bold text-gray-800">{item.nosOfQuestions}</div>
          </div>
          <div className="text-center border-x border-gray-100 px-1">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Duration</div>
            <div className="text-xs font-bold text-gray-800">{item.durationInMinutes} Min</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Price</div>
            <div className="text-xs font-bold text-brand-blue">
              {formatPrice(item.price)}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 pt-0 space-y-3">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
          className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-navy font-bold py-3 rounded-xl transition-colors text-sm shadow-sm"
        >
          View Details
        </button>
        {onAddToCart && (
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-brand-blue font-medium py-2 w-full transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  )
}

// Card Grid Container
export function QuizCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {children}
    </div>
  )
}
