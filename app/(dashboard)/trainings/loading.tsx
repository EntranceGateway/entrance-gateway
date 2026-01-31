import { CardGridSkeleton } from '@/components/shared/Loading'

export default function TrainingsLoading() {
  return (
    <main className="flex-grow bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="h-9 md:h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-5 sm:h-6 w-full max-w-3xl bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Content Skeleton */}
        <CardGridSkeleton count={4} />
      </div>
    </main>
  )
}
