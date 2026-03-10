import { CardGridSkeleton } from '@/components/shared/Loading'

export default function QuizLoading() {
  return (
    <main className="flex-grow bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Skeleton */}
        <div className="mb-8 sm:mb-10">
          <div className="h-10 sm:h-12 w-64 bg-gray-200 rounded-lg animate-pulse mb-3 sm:mb-4" />
          <div className="h-6 w-full max-w-3xl bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Cards Skeleton */}
        <CardGridSkeleton count={6} />
      </div>
    </main>
  )
}
