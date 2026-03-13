import Link from 'next/link'
import type { PaginatedResponse, PurchaseHistory } from '@/types/user.types'
import { Pagination } from '../Pagination'

interface PurchasesTabProps {
  data: PaginatedResponse<PurchaseHistory>
  onPageChange: (page: number) => void
}

export function PurchasesTab({ data, onPageChange }: PurchasesTabProps) {
  // Null safety checks
  if (!data || !data.content) {
    return (
      <div className="p-8 sm:p-12 text-center">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-16 mx-auto text-gray-300 mb-4">
          <path d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-1c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-6v11c0 1.1-.9 2-2 2H4v-2h17V7h2z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-500 mb-4">Unable to load purchase data.</p>
      </div>
    )
  }

  if (data.content.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-16 mx-auto text-gray-300 mb-4">
          <path d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-1c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-6v11c0 1.1-.9 2-2 2H4v-2h17V7h2z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Purchases Yet</h3>
        <p className="text-gray-500 mb-4">You haven't made any purchases.</p>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Browse Quizzes
        </Link>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'PAID':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'FAILED':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <>
      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {data.content.map((purchase) => (
          <div
            key={purchase.purchaseId}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-brand-navy text-sm">
                  {purchase?.setName || purchase?.trainingName || 'N/A'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {purchase?.setId ? `Quiz ID: ${purchase.setId}` : purchase?.trainingId ? `Training ID: ${purchase.trainingId}` : ''}
                </p>
              </div>
              {purchase?.purchaseStatus ? (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                    purchase.purchaseStatus
                  )}`}
                >
                  <span className="size-1.5 rounded-full bg-current"></span>
                  {purchase.purchaseStatus}
                </span>
              ) : (
                <span className="text-sm text-gray-400">N/A</span>
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-bold text-brand-navy">
                  {purchase?.amount !== undefined && purchase.amount !== null
                    ? `NPR ${purchase.amount.toLocaleString()}`
                    : 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Purchase Date:</span>
                <span className="text-gray-900">
                  {purchase?.purchaseDate ? new Date(purchase.purchaseDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }) : 'N/A'}
                </span>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">Transaction ID:</p>
                <p className="text-xs font-mono text-gray-600 break-all mt-1">
                  {purchase?.transactionId || 'N/A'}
                </p>
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
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Purchase Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.content.map((purchase, index) => (
              <tr
                key={purchase.purchaseId}
                className={`hover:bg-gray-50/50 ${index % 2 === 1 ? 'bg-gray-50/30' : ''}`}
              >
                <td className="px-6 py-4">
                  <p className="font-semibold text-brand-navy text-sm">
                    {purchase?.setName || purchase?.trainingName || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {purchase?.setId ? `Quiz ID: ${purchase.setId}` : purchase?.trainingId ? `Training ID: ${purchase.trainingId}` : ''}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs font-mono text-gray-600 break-all max-w-[200px]">
                    {purchase?.transactionId || 'N/A'}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-brand-navy">
                    {purchase?.amount !== undefined && purchase.amount !== null
                      ? `NPR ${purchase.amount.toLocaleString()}`
                      : 'N/A'}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {purchase?.purchaseDate ? new Date(purchase.purchaseDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }) : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  {purchase?.purchaseStatus ? (
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                        purchase.purchaseStatus
                      )}`}
                    >
                      <span className="size-1.5 rounded-full bg-current"></span>
                      {purchase.purchaseStatus}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">N/A</span>
                  )}
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
