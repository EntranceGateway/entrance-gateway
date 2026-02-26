import { CenteredSpinner } from '@/components/shared/Loading'

export default function TrainingEnrollmentLoading() {
  return (
    <main className="flex-grow">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CenteredSpinner size="lg" text="Loading enrollment form..." />
      </div>
    </main>
  )
}
