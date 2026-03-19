import Link from 'next/link'
import type { Training } from '@/types/trainings.types'

interface TrainingsCardProps {
  item: Training
  onDownloadSyllabus?: (id: number) => void
}

export function TrainingsCard({ item, onDownloadSyllabus }: TrainingsCardProps) {
  // Calculate capacity percentage
  const capacityPercentage = (item.currentParticipants / item.maxParticipants) * 100
  
  // Determine progress bar color based on capacity
  const getProgressColor = () => {
    if (capacityPercentage >= 80) return 'bg-semantic-warning'
    return 'bg-brand-blue'
  }

  // Calculate discounted price with validation
  const calculateDiscountedPrice = (price: number, offerPercentage: number | null) => {
    // Validate offerPercentage is within bounds (0-100)
    // Semantic: null = no discount offered, 0 = discount exists but is 0%, 1-100 = valid discount
    if (offerPercentage === null || offerPercentage <= 0 || offerPercentage > 100) {
      return price
    }
    return price - (price * offerPercentage / 100)
  }

  // Format price with discount
  const formatPrice = (price: number, offerPercentage: number | null) => {
    if (price === 0) {
      return <span className="text-green-600 font-bold">FREE</span>
    }

    // Only show discount if offerPercentage is explicitly set (not null) and within valid range (1-100)
    const validOfferPercentage = offerPercentage !== null && offerPercentage > 0 && offerPercentage <= 100
      ? offerPercentage
      : null
    
    const hasDiscount = validOfferPercentage !== null
    const discountedPrice = hasDiscount ? calculateDiscountedPrice(price, validOfferPercentage) : price

    if (hasDiscount) {
      return (
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] text-gray-400 line-through">
            NPR {price.toLocaleString()}
          </span>
          <span className="text-xs font-bold text-green-600">
            NPR {Math.round(discountedPrice).toLocaleString()}
          </span>
          <span className="text-[9px] text-green-600 font-semibold">
            {validOfferPercentage}% OFF
          </span>
        </div>
      )
    }

    return <span>NPR {price.toLocaleString()}</span>
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
      {/* Content */}
      <div className="p-6 flex-grow">
        {/* Header: Status Badge and Category */}
        <div className="flex justify-between items-start mb-4">
          <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {item.trainingStatus}
          </span>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {item.trainingCategory}
          </span>
        </div>

        {/* Training Title */}
        <h3 className="text-xl font-bold text-brand-navy mb-4 leading-tight">
          {item.trainingName}
        </h3>

        {/* Training Details Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6 py-4 border-y border-gray-100">
          <div className="text-center">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Type</div>
            <div className="text-xs font-bold text-gray-800">{item.trainingType}</div>
          </div>
          <div className="text-center border-x border-gray-100 px-1">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Duration</div>
            <div className="text-xs font-bold text-gray-800">{item.trainingHours} Hours</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Price</div>
            <div className="text-xs font-bold text-brand-blue">
              {formatPrice(item.price, item.offerPercentage)}
            </div>
          </div>
        </div>

        {/* Capacity Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-gray-600">Capacity</span>
            <span className="text-xs font-bold text-brand-navy">
              {item.currentParticipants}/{item.maxParticipants} joined
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`${getProgressColor()} h-full rounded-full transition-all duration-300`}
              style={{ width: `${capacityPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 pt-0 space-y-3">
        <Link
          href={`/trainings/${item.slug || item.trainingId}`}
          className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-navy font-bold py-3 rounded-xl transition-colors text-sm shadow-sm block text-center"
        >
          View Details
        </Link>
        {/* Always reserve space for download button to maintain consistent card height */}
        <div className="h-10 flex items-center justify-center">
          {item.materialsLink ? (
            <button
              onClick={() => onDownloadSyllabus?.(item.trainingId)}
              className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-brand-blue font-medium transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
              Download Syllabus
            </button>
          ) : (
            <div className="h-10" />
          )}
        </div>
      </div>
    </div>
  )
}

// Card Grid Container
export function TrainingsCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {children}
    </div>
  )
}
