import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BlogBreadcrumbProps {
  items: BreadcrumbItem[]
}

export function BlogBreadcrumb({ items }: BlogBreadcrumbProps) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav aria-label="Breadcrumb" className="flex text-sm font-medium text-gray-500">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            {items.map((item, index) => {
              const isLast = index === items.length - 1

              return (
                <li key={index} className={isLast ? 'inline-flex items-center' : ''}>
                  {index > 0 && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5 text-gray-300 mx-1"
                    >
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                  )}
                  {isLast ? (
                    <span
                      className="text-gray-900 truncate max-w-xs md:max-w-none"
                      aria-current="page"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      className="hover:text-brand-blue transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      </div>
    </div>
  )
}
