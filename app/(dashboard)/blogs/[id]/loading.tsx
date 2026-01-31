export default function BlogDetailLoading() {
  return (
    <main className="flex-grow">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b border-gray-100 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 bg-gray-200 rounded" />
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-4 w-48 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="h-6 w-16 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
            <div className="h-10 sm:h-12 md:h-14 w-full bg-gray-200 rounded mb-3" />
            <div className="h-10 sm:h-12 md:h-14 w-full sm:w-3/4 bg-gray-200 rounded" />
          </div>

          {/* Image */}
          <div className="h-64 sm:h-80 md:h-96 w-full bg-gray-200 rounded-2xl mb-10" />

          {/* Content */}
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-full sm:w-3/4 bg-gray-200 rounded" />
            <div className="h-8 w-32 sm:w-48 bg-gray-200 rounded mt-8" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-full sm:w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded mt-6" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-full sm:w-2/3 bg-gray-200 rounded" />
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="flex gap-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                </div>
              </div>
              <div className="h-10 w-40 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
