import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import type { OldQuestion } from '@/types/questions.types'

interface QuestionsCardProps {
  item: OldQuestion
}

export function QuestionsCard({ item }: QuestionsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md hover:border-brand-blue/30">
      {/* Header: Set Name with Icon */}
      <div className="flex items-center gap-3 mb-3">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-gray-400 shrink-0">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
        </svg>
        <h3 className="font-semibold text-brand-navy text-base leading-tight flex-1">
          {item.setName}
        </h3>
      </div>

      {/* Subject */}
      <div className="mb-3">
        <p className="text-sm text-gray-600">{item.subject}</p>
      </div>

      {/* Year and Course Badges */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
          {item.year}
        </span>
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            item.courseName === 'BCA' && 'bg-blue-100 text-blue-800',
            item.courseName === 'CSIT' && 'bg-indigo-100 text-indigo-800',
            item.courseName === 'BIT' && 'bg-purple-100 text-purple-800',
            item.courseName !== 'BCA' && item.courseName !== 'CSIT' && item.courseName !== 'BIT' && 'bg-green-100 text-green-800'
          )}
        >
          {item.courseName}
        </span>
      </div>

      {/* Affiliation */}
      <div className="mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-gray-400 shrink-0">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
          </svg>
          <span className="text-xs text-gray-600">{item.affiliation.replace(/_/g, ' ')}</span>
        </div>
      </div>

      {/* Action Button */}
      <Link
        href={`/questions/${item.id}`}
        className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-navy font-bold py-2 px-4 rounded-md text-sm transition-all shadow-sm flex items-center justify-center gap-2"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        </svg>
        View PDF
      </Link>
    </div>
  )
}

// Card List Container
export function QuestionsCardList({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
      {children}
    </div>
  )
}
