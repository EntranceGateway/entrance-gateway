import { CenteredSpinner } from '@/components/shared/Loading'

export default function TrainingsDetailLoading() {
  return (
    <main className="flex-grow">
      {/* Hero Skeleton */}
      <div className="bg-brand-navy py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-24 bg-brand-blue/30 rounded-full animate-pulse" />
              <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />
            </div>
            <div className="h-12 w-3/4 bg-white/20 rounded animate-pulse" />
            <div className="h-6 w-full max-w-2xl bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CenteredSpinner size="lg" text="Loading training details..." />
      </div>
    </main>
  )
}
