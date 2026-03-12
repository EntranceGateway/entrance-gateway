'use client'

interface ClearCartModalProps {
  itemCount: number
  onConfirm: () => void
  onCancel: () => void
}

export function ClearCartModal({ itemCount, onConfirm, onCancel }: ClearCartModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-8 text-white">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white font-heading">
              Clear Cart?
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700 text-base leading-relaxed">
            Are you sure you want to remove all <span className="font-bold text-brand-navy">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span> from your cart?
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-amber-600 flex-shrink-0 mt-0.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <p className="text-sm text-amber-800">
              This action cannot be undone. All items will be permanently removed from your cart.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border-2 border-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-red-600/30"
          >
            Yes, Clear Cart
          </button>
        </div>
      </div>
    </div>
  )
}
