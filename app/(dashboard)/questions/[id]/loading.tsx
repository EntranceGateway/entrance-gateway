import { CenteredSpinner } from '@/components/shared/Loading'

export default function QuestionDetailLoading() {
  return (
    <main className="flex-grow">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CenteredSpinner size="lg" text="Loading question..." />
      </div>
    </main>
  )
}
