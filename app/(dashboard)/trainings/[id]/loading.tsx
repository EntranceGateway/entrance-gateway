export default function TrainingsDetailLoading() {
  return (
    <main className="flex-grow">
      {/* Hero Skeleton */}
      <div className="bg-brand-navy py-12 lg:py-16 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-24 bg-brand-blue/30 rounded-full" />
              <div className="h-4 w-32 bg-white/20 rounded" />
            </div>
            <div className="h-12 w-3/4 bg-white/20 rounded" />
            <div className="h-6 w-full max-w-2xl bg-white/10 rounded" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section Skeleton */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 animate-pulse">
              <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
              </div>

              {/* Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-5 border border-gray-100 bg-gray-50 rounded-lg">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-3" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-200 rounded" />
                    <div className="h-3 w-full bg-gray-200 rounded" />
                    <div className="h-3 w-4/5 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="p-5 border border-gray-100 bg-gray-50 rounded-lg">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-3" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-200 rounded" />
                    <div className="h-3 w-full bg-gray-200 rounded" />
                    <div className="h-3 w-4/5 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Who Should Attend Skeleton */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 animate-pulse">
              <div className="h-8 w-56 bg-gray-200 rounded mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden animate-pulse">
              {/* Price Header Skeleton */}
              <div className="p-6 border-b border-gray-100">
                <div className="h-10 w-32 bg-gray-200 rounded" />
              </div>

              {/* Details Skeleton */}
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                </div>

                {/* Progress Bar Skeleton */}
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <div className="flex justify-between">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2" />
                </div>

                {/* Button Skeleton */}
                <div className="h-12 w-full bg-gray-200 rounded-lg" />
                <div className="h-3 w-full bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
