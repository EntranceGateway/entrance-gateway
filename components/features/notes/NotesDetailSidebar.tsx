import type { Note } from '@/types/notes.types'

interface NotesDetailSidebarProps {
  note: Note
}

export function NotesDetailSidebar({ note }: NotesDetailSidebarProps) {
  return (
    <aside className="w-full space-y-4 sm:space-y-6 lg:sticky lg:top-24">
      {/* Main Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Top Accent Bar */}
        <div className="h-1.5 bg-brand-navy w-full"></div>

        <div className="p-5 sm:p-6">
          {/* University Header */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shrink-0">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 text-brand-navy">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Affiliation
              </span>
              <h3 className="text-sm font-bold text-brand-navy truncate">
                {note.affiliation}
              </h3>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-brand-navy mb-2">
            {note.subject}
          </h1>
          <p className="text-gray-500 text-sm mb-6 sm:mb-8">
            Official academic note for {note.courseName} students.
          </p>

          {/* Details */}
          <div className="space-y-4">
            {/* Subject */}
            <div className="flex items-start gap-3">
              <div className="mt-1 shrink-0">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-blue">
                  <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">
                  code
                </p>
                <p className="font-medium text-gray-900">{note.subjectCode}</p>              </div>
            </div>

            {/* Semester */}
            <div className="flex items-start gap-3">
              <div className="mt-1 shrink-0">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-blue">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">
                  Semester
                </p>
                <p className="font-medium text-gray-900">Semester {note.semester}</p>
                {note.year && (
                  <p className="text-xs text-gray-500 mt-0.5">Year {note.year}</p>
                )}
              </div>
            </div>

            {/* Course */}
            <div className="flex items-start gap-3">
              <div className="mt-1 shrink-0">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-blue">
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">
                  Course
                </p>
                <p className="font-medium text-gray-900">{note.courseName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
