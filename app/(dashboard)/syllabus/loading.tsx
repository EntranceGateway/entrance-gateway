export default function SyllabusLoading() {
  return (
    <main className="flex-grow bg-gray-50">
      <div data-role="page-content" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-navy to-brand-blue p-6 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-32 rounded-full bg-white/20" />
            <div className="h-9 w-full max-w-xl rounded-xl bg-white/25" />
            <div className="h-4 w-full max-w-2xl rounded-full bg-white/15" />
            <div className="h-4 w-2/3 max-w-lg rounded-full bg-white/15" />
          </div>
        </div>

        <div className="mb-6 animate-pulse rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="size-5 rounded-full bg-gray-200" />
            <div className="h-5 flex-1 rounded-full bg-gray-200" />
          </div>
        </div>

        <div data-role="course-list-loading" className="space-y-3" aria-label="Loading syllabus courses">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between gap-4 p-4 sm:p-6">
                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                  <div className="size-10 shrink-0 animate-pulse rounded-lg bg-gray-200 sm:size-12" />
                  <div className="min-w-0 flex-1 animate-pulse space-y-2">
                    <div className="h-5 w-2/3 rounded-full bg-gray-200" />
                    <div className="flex gap-2">
                      <div className="h-4 w-20 rounded bg-gray-100" />
                      <div className="h-4 w-28 rounded bg-gray-100" />
                    </div>
                  </div>
                </div>
                <div className="size-5 shrink-0 animate-pulse rounded bg-gray-200" />
              </div>

              {index === 0 && (
                <div className="border-t border-gray-200 bg-gray-50 p-4 sm:px-6">
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((__, semesterIndex) => (
                      <div key={semesterIndex} className="rounded-lg border border-gray-200 bg-white p-4">
                        <div className="flex items-center gap-3 animate-pulse">
                          <div className="size-8 rounded-lg bg-gray-200" />
                          <div className="h-4 w-44 rounded-full bg-gray-200" />
                          <div className="ml-auto size-4 rounded bg-gray-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
