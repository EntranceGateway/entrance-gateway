interface NotesPaginationProps {
  currentPage: number
  totalItems: number
  totalPages: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function NotesPagination({
  currentPage,
  totalItems,
  totalPages,
  itemsPerPage,
  onPageChange,
}: NotesPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (totalPages <= 1) {
    return null // Don't show pagination if only one page
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-200 pt-8">
      {/* Results Info */}
      <div className="text-sm text-gray-500 mb-4 md:mb-0">
        Showing{' '}
        <span className="font-bold text-gray-800">{startItem}</span> to{' '}
        <span className="font-bold text-gray-800">{endItem}</span> of{' '}
        <span className="font-bold text-gray-800">{totalItems}</span> results
      </div>

      {/* Pagination Controls */}
      <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <span className="sr-only">Previous</span>
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
              >
                ...
              </span>
            )
          }

          const pageNumber = page as number
          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              aria-current={currentPage === pageNumber ? 'page' : undefined}
              className={
                currentPage === pageNumber
                  ? 'relative z-10 inline-flex items-center bg-brand-navy px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue'
                  : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
              }
            >
              {pageNumber}
            </button>
          )
        })}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <span className="sr-only">Next</span>
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
      </nav>
    </div>
  )
}
