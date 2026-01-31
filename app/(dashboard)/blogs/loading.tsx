import { CardGridSkeleton } from '@/components/shared/Loading'

export default function BlogsLoading() {
  return (
    <main className="flex-grow">
      {/* Hero Section Skeleton */}
      <div className="bg-white border-b border-gray-100 animate-pulse">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="h-12 w-96 bg-gray-200 rounded mx-auto mb-6" />
          <div className="h-6 w-full max-w-2xl bg-gray-200 rounded mx-auto" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CardGridSkeleton count={4} />
      </div>
    </main>
  )
}
