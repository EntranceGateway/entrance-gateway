import { Spinner } from '@/components/shared/Loading'

export default function SyllabusDetailLoading() {
  return (
    <main className="flex-grow">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-sm text-gray-600">Loading syllabus...</p>
          </div>
        </div>
      </div>
    </main>
  )
}
