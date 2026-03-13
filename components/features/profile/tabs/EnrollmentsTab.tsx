import Link from 'next/link'
import type { PaginatedResponse, TrainingEnrollmentHistory } from '@/types/user.types'
import { Pagination } from '../Pagination'

interface EnrollmentsTabProps {
  data: PaginatedResponse<TrainingEnrollmentHistory>
  onPageChange: (page: number) => void
}

export function EnrollmentsTab({ data, onPageChange }: EnrollmentsTabProps) {
  // Null safety checks
  if (!data || !data.content) {
    return (
      <div className="p-8 sm:p-12 text-center">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-16 mx-auto text-gray-300 mb-4">
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-500 mb-4">Unable to load enrollment data.</p>
      </div>
    )
  }

  if (data.content.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-16 mx-auto text-gray-300 mb-4">
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Enrollments Yet</h3>
        <p className="text-gray-500 mb-4">You haven't enrolled in any training programs.</p>
        <Link
          href="/trainings"
          className="inline-flex items-center gap-2 bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Browse Trainings
        </Link>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <>
      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {data.content.map((enrollment) => (
          <div
            key={enrollment.enrollmentId}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-brand-navy text-sm flex-1">
                {enrollment?.trainingName || 'N/A'}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                  enrollment?.status || 'ACTIVE'
                )}`}
              >
                <span className="size-1.5 rounded-full bg-current"></span>
                {enrollment?.status || 'ACTIVE'}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Payment:</span>
                <span className="font-semibold text-gray-900">
                  NPR {(enrollment?.paidAmount ?? 0).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Enrolled:</span>
                <span className="text-gray-900">
                  {enrollment?.enrollmentDate ? new Date(enrollment.enrollmentDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }) : 'N/A'}
                </span>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-500">Progress:</span>
                  <span className="text-xs font-bold text-gray-900">
                    {enrollment?.progressPercentage || 0}%
                  </span>
                </div>
                <div 
                  className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={enrollment?.progressPercentage || 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Training progress: ${enrollment?.progressPercentage || 0}%`}
                >
                  <div
                    className={`h-full ${
                      enrollment?.status === 'COMPLETED'
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${enrollment?.progressPercentage || 0}%` }}
                  ></div>
                </div>
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
              <th className="px-6 py-4">Training Name</th>
              <th className="px-6 py-4">Enrollment Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.content.map((enrollment, index) => (
              <tr
                key={enrollment.enrollmentId}
                className={`hover:bg-gray-50/50 ${index % 2 === 1 ? 'bg-gray-50/30' : ''}`}
              >
                <td className="px-6 py-4">
                  <p className="font-semibold text-brand-navy text-sm">
                    {enrollment?.trainingName || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Payment: NPR {(enrollment?.paidAmount ?? 0).toLocaleString()}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {enrollment?.enrollmentDate ? new Date(enrollment.enrollmentDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }) : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                      enrollment?.status || 'ACTIVE'
                    )}`}
                  >
                    <span className="size-1.5 rounded-full bg-current"></span>
                    {enrollment?.status || 'ACTIVE'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div 
                    className="w-full max-w-[100px] h-1.5 bg-gray-100 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={enrollment?.progressPercentage || 0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Training progress: ${enrollment?.progressPercentage || 0}%`}
                  >
                    <div
                      className={`h-full ${
                        enrollment?.status === 'COMPLETED'
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${enrollment?.progressPercentage || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 mt-1 block">
                    {enrollment?.progressPercentage || 0}%
                  </span>
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
