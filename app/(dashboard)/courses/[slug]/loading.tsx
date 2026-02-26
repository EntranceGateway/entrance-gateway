import { CenteredSpinner } from '@/components/shared/Loading'

export default function CourseDetailLoading() {
  return (
    <main className="flex-grow">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-br from-brand-navy to-brand-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="h-4 w-32 bg-white/20 rounded animate-pulse mb-6" />
          <div className="h-12 w-64 bg-white/20 rounded animate-pulse mb-4" />
          <div className="flex gap-4">
            <div className="h-6 w-40 bg-white/20 rounded animate-pulse" />
            <div className="h-6 w-32 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CenteredSpinner size="lg" text="Loading course..." />
      </div>
    </main>
  )
}
