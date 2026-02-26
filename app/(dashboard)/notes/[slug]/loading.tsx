import { DetailPageSkeleton } from '@/components/shared/Loading'

export default function NotesDetailLoading() {
  return (
    <main className="flex-grow">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <DetailPageSkeleton />
      </div>
    </main>
  )
}
