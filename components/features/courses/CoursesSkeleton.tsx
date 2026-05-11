function CourseCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
      <div className="relative space-y-4">
        <div className="h-6 w-2/3 rounded-lg bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-full bg-amber-100" />
          <div className="h-4 w-32 rounded bg-gray-200" />
        </div>
        <div className="space-y-2">
          <div className="h-3.5 w-full rounded bg-gray-100" />
          <div className="h-3.5 w-11/12 rounded bg-gray-100" />
          <div className="h-3.5 w-3/5 rounded bg-gray-100" />
        </div>
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-4 w-20 rounded bg-gray-200" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 w-36 rounded bg-blue-100" />
          <div className="size-5 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

export function CoursesSkeleton() {
  return (
    <main className="flex-grow bg-gray-50/40">
      <div data-role="page-content" className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-4 sm:py-8 md:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10">
          <div className="mb-3 h-9 w-40 rounded-xl bg-gray-200 sm:h-10" />
          <div className="h-4 w-full max-w-md rounded bg-gray-100" />
        </div>

        <div data-role="course-list-skeleton" className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-2">
          <div className="h-10 w-24 rounded-lg bg-gray-200" />
          <div className="h-10 w-28 rounded-lg bg-gray-100" />
          <div className="h-10 w-24 rounded-lg bg-gray-200" />
        </div>
      </div>
    </main>
  )
}
