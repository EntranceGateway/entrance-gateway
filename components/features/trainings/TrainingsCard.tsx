import type { Training } from '@/types/trainings.types'

interface TrainingsCardProps {
  item: Training
  onViewDetails?: (id: number) => void
  onDownloadSyllabus?: (id: number) => void
}

export function TrainingsCard({ item, onViewDetails, onDownloadSyllabus }: TrainingsCardProps) {
  // Calculate capacity percentage
  const capacityPercentage = (item.currentParticipants / item.maxParticipants) * 100
  
  // Determine progress bar color based on capacity
  const getProgressColor = () => {
    if (capacityPercentage >= 80) return 'bg-semantic-warning'
    return 'bg-brand-blue'
  }

  // Format price
  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString()}`
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
              {formatPrice(item.price)}
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
        <button
          onClick={() => onViewDetails?.(item.trainingId)}
          className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-navy font-bold py-3 rounded-xl transition-colors text-sm shadow-sm"
        >
          View Details
        </button>
        {item.materialsLink && (
          <button
            onClick={() => onDownloadSyllabus?.(item.trainingId)}
            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-brand-blue font-medium py-2 w-full transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            Download Syllabus
          </button>
        )}
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
