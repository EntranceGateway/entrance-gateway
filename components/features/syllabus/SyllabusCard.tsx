import { cn } from '@/lib/utils/cn'

interface SyllabusItem {
  id: string
  code: string
  name: string
  course: string
  yearSemester: string
  creditHours: number
}

interface SyllabusCardProps {
  item: SyllabusItem
  onClick?: (id: string) => void
}

export function SyllabusCard({ item, onClick }: SyllabusCardProps) {
  // SCRAPER: data-role="syllabus-card"
  return (
    <article
      onClick={() => onClick?.(item.id)}
      data-role="syllabus-card"
      data-subject-code={item.code}
      data-course={item.course}
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-200 group cursor-pointer',
        'hover:shadow-xl hover:border-brand-blue hover:-translate-y-1 hover:scale-[1.02]'
      )}
    >
      {/* Header: Code and Badge */}
      <div className="flex items-center gap-2 mb-2">
        {/* SCRAPER: data-role="subject-code" */}
        <code data-role="subject-code" className="font-mono text-sm text-gray-600 font-medium bg-gray-50 px-2 py-1 rounded">
          {item.code}
        </code>
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border',
            item.course === 'CSIT'
              ? 'bg-blue-100/50 text-brand-blue border-blue-200'
              : 'bg-indigo-100/50 text-indigo-700 border-indigo-200'
          )}
        >
          {item.course}
        </span>
      </div>

      {/* Subject Name */}
      {/* SCRAPER: data-role="subject-name" */}
      <h3 data-role="subject-name" className="font-semibold text-brand-navy text-base leading-tight mb-3 group-hover:text-brand-blue transition-colors">
        {item.name}
      </h3>

      {/* Footer: Year/Semester and Credits */}
      <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1 text-gray-600">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4 text-gray-400"
          >
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
          </svg>
          {/* SCRAPER: data-role="semester" */}
          <span data-role="semester">{item.yearSemester}</span>
        </div>
        <div className="flex items-center gap-1 font-medium text-brand-navy">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4 text-brand-blue"
          >
            <path d="M12 2L1 7l11 5 9-4.09V17h2V6z" />
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17z" />
          </svg>
          {/* SCRAPER: data-role="credit-hours" */}
          <span data-role="credit-hours">{item.creditHours} Credits</span>
        </div>
      </div>

      {/* View Button - Mobile/Tablet Only */}
      {onClick && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => onClick(item.id)}
            className="w-full bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-2 px-4 rounded-lg transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
            View Syllabus
          </button>
        </div>
      )}
    </article>
  )
}

// Card List Container
export function SyllabusCardList({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
      {children}
    </div>
  )
}
