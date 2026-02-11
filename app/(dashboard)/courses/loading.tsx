import { CenteredSpinner } from '@/components/shared/Loading'

export default function CoursesLoading() {
  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-5 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <CenteredSpinner size="lg" text="Loading courses..." />
      </div>
    </main>
  )
}
