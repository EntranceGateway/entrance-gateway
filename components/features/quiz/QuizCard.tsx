import type { Quiz } from '@/types/quiz.types'
import type { PurchaseStatus } from '@/types/payment.types'

interface QuizCardProps {
  item: Quiz
  onClick?: () => void
  onAddToCart?: (quiz: Quiz) => void
  purchaseStatus?: PurchaseStatus
}

export function QuizCard({ item, onClick, onAddToCart, purchaseStatus }: QuizCardProps) {
  // Format price
  const formatPrice = (price?: number) => {
    return `NPR ${(price ?? 0).toLocaleString()}`
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart?.(item)
  }

  // Get status badge based on purchase status
  const getStatusBadge = () => {
    if (!purchaseStatus || purchaseStatus === 'NOT_PURCHASED') {
      return (
        <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          AVAILABLE
        </span>
      )
    }
    
    if (purchaseStatus === 'PAID' || purchaseStatus === 'ACTIVE' || purchaseStatus === 'PAYMENT_VERIFIED') {
      return (
        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          PURCHASED
        </span>
      )
    }
    
    if (purchaseStatus === 'PENDING') {
      return (
        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          PENDING
        </span>
      )
    }
    
    if (purchaseStatus === 'PAYMENT_RECEIVED_ADMIN_APPROVAL_PENDING' || purchaseStatus === 'APPROVAL_PENDING') {
      return (
        <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          APPROVAL PENDING
        </span>
      )
    }
    
    if (purchaseStatus === 'FAILED' || purchaseStatus === 'PAYMENT_FAILED' || purchaseStatus === 'ABORTED') {
      return (
        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          FAILED
        </span>
      )
    }

    if (purchaseStatus === 'CANCELLED' || purchaseStatus === 'CANCELLED_BY_ADMIN') {
      return (
        <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          CANCELLED
        </span>
      )
    }
    
    if (purchaseStatus === 'ERROR') {
      return (
        <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          UNKNOWN
        </span>
      )
    }
    
    return (
      <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
        AVAILABLE
      </span>
    )
  }

  return (
    <article
      onClick={onClick}
      data-role="quiz-item"
      data-quiz-title={item.setName}
      data-course-name={item.courseName}
      data-question-count={item.nosOfQuestions}
      data-duration={item.durationInMinutes}
      data-price={item.price ?? 0}
      data-detail-uri={`/quiz/${item.slug || item.questionSetId}/start`}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Content */}
      <div className="p-6 flex-grow">
        {/* Header: Status Badge and Category */}
        <div className="flex justify-between items-start mb-4">
          {getStatusBadge()}
          <span data-role="course-name" className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {item.courseName}
          </span>
        </div>

        {/* Quiz Title */}
        <h3 data-role="quiz-title" className="text-xl font-bold text-brand-navy mb-4 leading-tight">
          {item.setName}
        </h3>

        {/* Quiz Details Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6 py-4 border-y border-gray-100">
          <div className="text-center">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Questions</div>
            <div data-role="question-count" className="text-xs font-bold text-gray-800">{item.nosOfQuestions}</div>
          </div>
          <div className="text-center border-x border-gray-100 px-1">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Duration</div>
            <div data-role="duration" className="text-xs font-bold text-gray-800">{item.durationInMinutes} Min</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Price</div>
            <div data-role="price" className="text-xs font-bold text-brand-blue">
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
          data-role="quiz-link"
          data-detail-uri={`/quiz/${item.slug || item.questionSetId}/start`}
          className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-navy font-bold py-3 rounded-xl transition-colors text-sm shadow-sm"
        >
          View Details
        </button>
        {/* Always reserve space for add to cart button to maintain consistent card height */}
        <div className="h-10 flex items-center justify-center">
          {onAddToCart ? (
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-brand-blue font-medium transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              Add to Cart
            </button>
          ) : (
            <div className="h-10" />
          )}
        </div>
      </div>
    </article>
  )
}

// Card Grid Container
export function QuizCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div data-role="quiz-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {children}
    </div>
  )
}
