import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { QuestionsCard, QuestionsCardList } from './QuestionsCard'
import { Spinner } from '@/components/shared/Loading'
import type { OldQuestion } from '@/types/questions.types'

interface QuestionsTableProps {
  data: OldQuestion[]
  isLoading?: boolean
}

export function QuestionsTable({ data, isLoading }: QuestionsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-12 text-gray-300 mx-auto mb-4">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
        <p className="text-sm text-gray-500">Try adjusting your filters to see more results.</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table View - Hidden on mobile/tablet */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-navy text-white">
                <th className="px-6 py-4 text-sm font-semibold tracking-wide border-b border-gray-200">
                  Set Name
                </th>
                <th className="px-6 py-4 text-sm font-semibold tracking-wide border-b border-gray-200">
                  Subject
                </th>
                <th className="px-6 py-4 text-sm font-semibold tracking-wide border-b border-gray-200 text-center">
                  Year
                </th>
                <th className="px-6 py-4 text-sm font-semibold tracking-wide border-b border-gray-200">
                  Course
                </th>
                <th className="px-6 py-4 text-sm font-semibold tracking-wide border-b border-gray-200">
                  Affiliation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr
                  key={item.id}
                  className={cn(
                    'transition-colors hover:bg-brand-blue/5',
                    index % 2 === 1 && 'bg-gray-50'
                  )}
                >
                  <td className="px-6 py-4">
                    <Link href={`/questions/${item.slug || item.id}`} className="flex items-center gap-3 group">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-gray-400 shrink-0 group-hover:text-brand-blue transition-colors">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900 group-hover:text-brand-blue transition-colors">{item.setName}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.subject}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">{item.year}</td>
                  <td className="px-6 py-4">
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
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      {item.affiliation.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{data.length}</span> questions
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Card View - Hidden on desktop */}
      <div className="lg:hidden">
        <QuestionsCardList>
          {data.map((item) => (
            <QuestionsCard key={item.id} item={item} />
          ))}
        </QuestionsCardList>
      </div>
    </>
  )
}
