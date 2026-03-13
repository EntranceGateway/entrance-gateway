import Link from 'next/link'
import type { PaginatedResponse, AdmissionHistory } from '@/types/user.types'
import { Pagination } from '../Pagination'

interface AdmissionsTabProps {
  data: PaginatedResponse<AdmissionHistory>
  onPageChange: (page: number) => void
}

export function AdmissionsTab({ data, onPageChange }: AdmissionsTabProps) {
  // Null safety checks
  if (!data || !data.content) {
    return (
      <div className="p-8 sm:p-12 text-center">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-16 mx-auto text-gray-300 mb-4">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-500 mb-4">Unable to load admission data.</p>
      </div>
    )
  }

  if (data.content.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-16 mx-auto text-gray-300 mb-4">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Admissions Yet</h3>
        <p className="text-gray-500 mb-4">You haven't applied for any college admissions.</p>
        <Link
          href="/colleges"
          className="inline-flex items-center gap-2 bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Browse Colleges
        </Link>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'WAITLISTED':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-widest">
              <th className="px-4 sm:px-6 py-3 sm:py-4">College & Course</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4">Applied At</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4">Status</th>
              <th className="px-4 sm:px-6 py-3 sm:py-4">Approval Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.content.map((admission, index) => (
              <tr
                key={admission.admissionId}
                className={`hover:bg-gray-50/50 ${index % 2 === 1 ? 'bg-gray-50/30' : ''}`}
              >
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  <p className="font-semibold text-brand-navy text-sm">
                    {admission?.collegeName || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">{admission?.courseName || 'N/A'}</p>
                  {admission?.remarks && (
                    <p className="text-xs text-gray-400 mt-1 italic">{admission.remarks}</p>
                  )}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                  {admission?.applicationDate ? new Date(admission.applicationDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }) : 'N/A'}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4">
                  {admission?.status ? (
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                        admission.status
                      )}`}
                    >
                      <span className="size-1.5 rounded-full bg-current"></span>
                      {admission.status}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                  {admission?.approvalDate
                    ? new Date(admission.approvalDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        onPageChange={onPageChange}
      />
    </>
  )
}
