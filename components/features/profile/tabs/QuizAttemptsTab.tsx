import Link from 'next/link'
import type { PaginatedResponse, QuizAttemptHistory } from '@/types/user.types'
import { Pagination } from '../Pagination'

interface QuizAttemptsTabProps {
  data: PaginatedResponse<QuizAttemptHistory>
  onPageChange: (page: number) => void
}

export function QuizAttemptsTab({ data, onPageChange }: QuizAttemptsTabProps) {
  // Null safety checks
  if (!data || !data.content) {
    return (
      <div className="p-8 sm:p-12 text-center">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-16 mx-auto text-gray-300 mb-4">
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-500 mb-4">Unable to load quiz attempt data.</p>
      </div>
    )
  }

  if (data.content.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-16 mx-auto text-gray-300 mb-4">
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quiz Attempts Yet</h3>
        <p className="text-gray-500 mb-4">You haven't attempted any quizzes.</p>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Browse Quizzes
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {data.content.map((attempt) => (
          <div
            key={attempt.attemptId}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-brand-navy text-sm">
                  {attempt?.questionSetName || 'N/A'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">ID: {attempt?.questionSetId || 'N/A'}</p>
              </div>
              {attempt?.isCorrect !== undefined ? (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                    attempt.isCorrect
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-red-100 text-red-700 border-red-200'
                  }`}
                >
                  <span className="size-1.5 rounded-full bg-current"></span>
                  {attempt.isCorrect ? 'CORRECT' : 'INCORRECT'}
                </span>
              ) : (
                <span className="text-sm text-gray-400">N/A</span>
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Question:</p>
                <p className="text-gray-900 line-clamp-3">
                  {attempt?.questionText || 'N/A'}
                </p>
              </div>
              
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="text-gray-500">Attempted:</span>
                <span className="text-gray-900">
                  {attempt?.attemptDate ? new Date(attempt.attemptDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-widest">
              <th className="px-6 py-4">Quiz Name</th>
              <th className="px-6 py-4">Question</th>
              <th className="px-6 py-4">Result</th>
              <th className="px-6 py-4">Attempted At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.content.map((attempt, index) => (
              <tr
                key={attempt.attemptId}
                className={`hover:bg-gray-50/50 ${index % 2 === 1 ? 'bg-gray-50/30' : ''}`}
              >
                <td className="px-6 py-4">
                  <p className="font-semibold text-brand-navy text-sm">
                    {attempt?.questionSetName || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">ID: {attempt?.questionSetId || 'N/A'}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600 line-clamp-2 max-w-md">
                    {attempt?.questionText || 'N/A'}
                  </p>
                </td>
                <td className="px-6 py-4">
                  {attempt?.isCorrect !== undefined ? (
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        attempt.isCorrect
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      }`}
                    >
                      <span className="size-1.5 rounded-full bg-current"></span>
                      {attempt.isCorrect ? 'CORRECT' : 'INCORRECT'}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {attempt?.attemptDate ? new Date(attempt.attemptDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }) : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4">
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </>
  )
}
