import type { QuizHistoryItem } from '@/services/client/quizAttempt.client'

interface QuizHistoryCardProps {
  item: QuizHistoryItem
  onClick?: () => void
}

export function QuizHistoryCard({ item, onClick }: QuizHistoryCardProps) {
  // Format Date gracefully (using implicit local format instead of hardcoded i18n)
  const formattedDate = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(item.attemptedAt))

  // Convert seconds to human-readable (e.g. "1h 15m" or "45m")
  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes} Min`
  }

  // Get status badge dynamically based on final PASSED/FAILED grades
  const getStatusBadge = () => {
    const status = item.status?.toUpperCase()
    
    if (status === 'PASSED') {
      return (
        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          PASSED
        </span>
      )
    }
    
    if (status === 'FAILED') {
      return (
        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          FAILED
        </span>
      )
    }
    
    return (
      <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
        {status || 'COMPLETED'}
      </span>
    )
  }

  const isPassing = item.percentage >= 60 // Assuming typical pass threshold

  return (
    <article
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
      data-role="quiz-history-item"
      data-history-id={item.id}
      className={`bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow relative ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Decorative percentage bar at the absolute top */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gray-100">
        <div 
          className={`h-full ${isPassing ? 'bg-green-500' : 'bg-red-500'}`} 
          style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
        />
      </div>

      <div className="p-6 flex-grow mt-1">
        {/* Header: Date and Status Badge */}
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">
            {formattedDate}
          </span>
          {getStatusBadge()}
        </div>

        {/* Quiz Title */}
        <h3 title={item.quizName} className="text-xl font-bold text-brand-navy mb-4 leading-tight line-clamp-2">
          {item.quizName}
        </h3>

        {/* Metrics Highlights Grid (Score, Accuracy, Duration) */}
        <div className="grid grid-cols-3 gap-2 mb-4 py-4 border-y border-gray-100">
          <div className="text-center">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Grade</div>
            <div className={`text-xs font-bold ${isPassing ? 'text-green-600' : 'text-red-500'}`}>
              {item.percentage}%
            </div>
          </div>
          <div className="text-center border-x border-gray-100 px-1">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Accuracy</div>
            <div className="flex justify-center items-center gap-1 text-[10px] font-bold mt-0.5">
              <span className="text-green-600">{item.correctAnswers}</span>
              <span className="text-gray-300">/</span>
              <span className="text-red-500">{item.wrongAnswers}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-gray-400 uppercase font-bold">Time</div>
            <div className="text-xs font-bold text-gray-600">
              {formatDuration(item.timeTakenSeconds)}
            </div>
          </div>
        </div>

        {/* Bottom Detailed Stat String */}
        <div className="text-center text-xs text-gray-500">
          Scored <span className="font-bold text-brand-navy">{item.totalScore}</span> points across <span className="font-bold text-brand-navy">{item.totalQuestions}</span> questions.
        </div>
      </div>
    </article>
  )
}
