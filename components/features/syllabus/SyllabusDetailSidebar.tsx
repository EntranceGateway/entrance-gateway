interface SubjectInfo {
  code: string
  creditHours: number
  lectureHours: number
  practicalHours: number
  program: string
  semester: string
  year: number
  subjectName: string
}

interface SyllabusDetailSidebarProps {
  info: SubjectInfo
}

export function SyllabusDetailSidebar({ info }: SyllabusDetailSidebarProps) {
  return (
    <aside className="w-full space-y-4 sm:space-y-6 lg:sticky lg:top-24">
      {/* Subject Information Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-gray-600">
            Subject Information
          </h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {/* Subject Name */}
          <div className="px-4 sm:px-5 py-3 sm:py-4 group hover:bg-gray-50 transition-colors">
            <p className="text-gray-500 text-xs font-medium mb-1">Subject Name</p>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5 text-brand-gold shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
              <p className="text-gray-900 text-sm font-medium">{info.subjectName}</p>
            </div>
          </div>

          {/* Course Code */}
          <div className="px-4 sm:px-5 py-3 sm:py-4 group hover:bg-gray-50 transition-colors">
            <p className="text-gray-500 text-xs font-medium mb-1">Course Code</p>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5 text-brand-gold shrink-0">
                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
              </svg>
              <p className="text-gray-900 text-sm font-medium">{info.code}</p>
            </div>
          </div>

          {/* Credit Hours */}
          <div className="px-4 sm:px-5 py-3 sm:py-4 group hover:bg-gray-50 transition-colors">
            <p className="text-gray-500 text-xs font-medium mb-1">Credit Hours</p>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5 text-brand-gold shrink-0">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              <p className="text-gray-900 text-sm font-medium">{info.creditHours} Credit Hours</p>
            </div>
          </div>

          {/* Lecture Hours */}
          {info.lectureHours > 0 && (
            <div className="px-4 sm:px-5 py-3 sm:py-4 group hover:bg-gray-50 transition-colors">
              <p className="text-gray-500 text-xs font-medium mb-1">Lecture Hours</p>
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5 text-brand-gold shrink-0">
                  <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 10h9v2H5zm0-3h9v2H5zm0 6h5v2H5zm11-1l4-4v10z" />
                </svg>
                <p className="text-gray-900 text-sm font-medium">{info.lectureHours} Hours</p>
              </div>
            </div>
          )}

          {/* Practical Hours */}
          {info.practicalHours > 0 && (
            <div className="px-4 sm:px-5 py-3 sm:py-4 group hover:bg-gray-50 transition-colors">
              <p className="text-gray-500 text-xs font-medium mb-1">Practical Hours</p>
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5 text-brand-gold shrink-0">
                  <path d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2l-1.5 1.5zM19 19c0 .55-.45 1-1 1s-1-.45-1-1v-3H8V5h11v14z" />
                </svg>
                <p className="text-gray-900 text-sm font-medium">{info.practicalHours} Hours</p>
              </div>
            </div>
          )}

          {/* Program */}
          <div className="px-4 sm:px-5 py-3 sm:py-4 group hover:bg-gray-50 transition-colors">
            <p className="text-gray-500 text-xs font-medium mb-1">Program</p>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5 text-brand-gold shrink-0">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
              </svg>
              <p className="text-gray-900 text-sm font-medium">{info.program}</p>
            </div>
          </div>

          {/* Semester */}
          <div className="px-4 sm:px-5 py-3 sm:py-4 group hover:bg-gray-50 transition-colors">
            <p className="text-gray-500 text-xs font-medium mb-1">Semester</p>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5 text-brand-gold shrink-0">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
              </svg>
              <p className="text-gray-900 text-sm font-medium">{info.semester}</p>
            </div>
          </div>

          {/* Year */}
          <div className="px-4 sm:px-5 py-3 sm:py-4 group hover:bg-gray-50 transition-colors">
            <p className="text-gray-500 text-xs font-medium mb-1">Year</p>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5 text-brand-gold shrink-0">
                <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
              </svg>
              <p className="text-gray-900 text-sm font-medium">Year {info.year}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Study Tip Card */}
      <div className="bg-brand-gold/10 rounded-xl p-4 sm:p-5 border border-brand-gold/20">
        <div className="flex items-start gap-2 sm:gap-3">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5 text-brand-gold mt-0.5 shrink-0">
            <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
          </svg>
          <div>
            <h4 className="font-bold text-brand-navy text-xs sm:text-sm">Study Tip</h4>
            <p className="text-xs text-gray-700 mt-1 leading-relaxed">
              Review the syllabus thoroughly and focus on understanding core concepts. Practice regularly for better retention.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
