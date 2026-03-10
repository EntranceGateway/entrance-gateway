import type { Quiz } from '@/types/quiz.types'

interface QuizCardProps {
  item: Quiz
  onClick?: () => void
  onAddToCart?: (quiz: Quiz) => void
}

export function QuizCard({ item, onClick, onAddToCart }: QuizCardProps) {
  // Format price with fallback
  const formatPrice = (price?: number) => {
    return `NPR ${(price ?? 0).toLocaleString()}`
  }

  // Get category badge color with fallback
  const getCategoryColor = () => {
    const category = (item.courseName || 'General').toUpperCase()
    if (category.includes('BCA')) return 'bg-brand-lavender text-brand-purple'
    if (category.includes('NEB')) return 'bg-blue-50 text-brand-blue'
    if (category.includes('CSIT')) return 'bg-gray-100 text-gray-500'
    return 'bg-brand-lavender text-brand-purple'
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart?.(item)
  }

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:border-brand-blue/30 cursor-pointer"
    >
      {/* Content */}
      <div className="p-6 flex-grow">
        {/* Header: Category Badge and Price */}
        <div className="flex justify-between items-start mb-6">
          <span className={`${getCategoryColor()} text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
            {item.courseName}
          </span>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">Price</p>
            <p className="text-xl font-bold text-brand-navy">{formatPrice(item.price)}</p>
          </div>
        </div>

        {/* Quiz Title */}
        <h3 className="text-2xl font-bold text-brand-navy mb-4 font-heading leading-tight">
          {item.setName}
        </h3>

        {/* Quiz Details */}
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <span className="material-symbols-outlined text-gray-400 mr-3 text-[20px]">menu_book</span>
            <span className="text-sm font-medium">
              {item.nosOfQuestions} {item.nosOfQuestions === 1 ? 'Question' : 'Questions'}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="material-symbols-outlined text-gray-400 mr-3 text-[20px]">schedule</span>
            <span className="text-sm font-medium">{item.durationInMinutes} Minutes</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 pt-2 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
          className="flex-1 bg-brand-gold text-brand-navy font-bold py-3.5 rounded-lg hover:bg-brand-gold/90 transition-colors shadow-sm active:scale-[0.98] transform uppercase text-sm tracking-wide"
        >
          View Details
        </button>
        {onAddToCart && (
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-1 bg-brand-blue hover:bg-brand-navy text-white font-bold py-3.5 px-4 rounded-lg transition-colors shadow-sm active:scale-[0.98] transform"
            title="Add to Cart"
          >
            <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
          </button>
        )}
      </div>
    </div>
  )
}

// Card Grid Container
export function QuizCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {children}
    </div>
  )
}
