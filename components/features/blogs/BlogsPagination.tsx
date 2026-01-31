interface BlogsPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function BlogsPagination({ currentPage, totalPages, onPageChange }: BlogsPaginationProps) {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col items-center gap-4">
      <p className="text-sm text-gray-500 font-medium">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        {/* Previous Button */}
        <button
          onClick={() => canGoPrevious && onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className={`p-2 rounded border ${
            canGoPrevious
              ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
              : 'border-gray-200 text-gray-300 cursor-not-allowed'
          }`}
          aria-label="Previous page"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        {/* Page Number */}
        <button className="w-10 h-10 rounded bg-brand-navy text-white font-bold text-sm">
          {currentPage}
        </button>

        {/* Next Button */}
        <button
          onClick={() => canGoNext && onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className={`p-2 rounded border ${
            canGoNext
              ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
              : 'border-gray-200 text-gray-300 cursor-not-allowed'
          }`}
          aria-label="Next page"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
