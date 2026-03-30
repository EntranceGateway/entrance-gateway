import Link from 'next/link'

interface NavigationItem {
  label: string
  title: string
  href: string
}

interface SyllabusNavigationProps {
  previous?: NavigationItem
  next?: NavigationItem
  semesterLink?: {
    label: string
    href: string
  }
}

export function SyllabusNavigation({ previous, next, semesterLink }: SyllabusNavigationProps) {
  // SCRAPER: Navigation links with data-role="*-link"
  return (
    <nav className="bg-white rounded-xl p-6 shadow-sm border border-gray-200" data-role="syllabus-navigation">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Previous Subject */}
        {previous ? (
          <Link
            href={previous.href}
            data-role="prev-link"
            className="flex items-center gap-3 text-gray-500 hover:text-brand-navy transition-colors group"
          >
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-brand-gold/20 transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </div>
            <div className="text-left">
              <span className="block text-xs uppercase tracking-wide text-gray-500">
                {previous.label}
              </span>
              <span className="font-bold text-sm text-gray-900">{previous.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {/* Semester Link */}
        {semesterLink && (
          <Link
            href={semesterLink.href}
            data-role="semester-link"
            className="text-brand-blue hover:text-brand-navy hover:underline text-sm font-semibold transition-colors"
          >
            {semesterLink.label}
          </Link>
        )}

        {/* Next Subject */}
        {next ? (
          <Link
            href={next.href}
            data-role="next-link"
            className="flex items-center gap-3 text-gray-500 hover:text-brand-navy transition-colors group text-right"
          >
            <div className="text-right">
              <span className="block text-xs uppercase tracking-wide text-gray-500">
                {next.label}
              </span>
              <span className="font-bold text-sm text-gray-900">{next.title}</span>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-brand-gold/20 transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  )
}
