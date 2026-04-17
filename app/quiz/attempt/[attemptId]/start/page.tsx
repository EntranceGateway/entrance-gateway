'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getGeneratedQuizAttempt } from '@/services/client/quizAttempt.client'
import type { QuizQuestion } from '@/types/quiz-player.types'

// Dynamically import QuizPlayerContent with SSR disabled
const QuizPlayerContent = dynamic(
  () => import('@/components/features/quiz/QuizPlayerContent').then(mod => ({ default: mod.QuizPlayerContent })),
  { 
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-[60] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block size-12 animate-spin rounded-full border-4 border-solid border-brand-blue border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your AI generated set...</p>
        </div>
      </div>
    )
  }
)

export default function CustomQuizStartPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const router = useRouter()
  const unwrappedParams = use(params)
  
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attemptId, setAttemptId] = useState<number>(0)

  useEffect(() => {
    const loadAttempt = async () => {
      const parsedAttemptId = parseInt(unwrappedParams.attemptId, 10)
      if (isNaN(parsedAttemptId)) {
        setError('Invalid Quiz Attempt ID provided.')
        return
      }
      
      setAttemptId(parsedAttemptId)
      let snapshotStr = sessionStorage.getItem(`quiz_attempt_snapshot_${parsedAttemptId}`)

      // Fallback: If snapshot is not in ephemeral cache (e.g., direct link or cleared cache),
      // fetch it dynamically from the database using our proxy.
      if (!snapshotStr) {
        try {
          const response = await getGeneratedQuizAttempt(parsedAttemptId)
          if (response.data?.questionsSnapshotJson) {
            snapshotStr = response.data.questionsSnapshotJson
            // Re-hydrate cache for any immediate local nav reloads
            sessionStorage.setItem(`quiz_attempt_snapshot_${parsedAttemptId}`, snapshotStr)
          } else {
            throw new Error('Database response missing payload.')
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Database sync failed.'
          setError(`Unable to restore practice set: ${msg}`)
          return
        }
      }

      try {
        // Parse snapshot and strictly map it to the legacy QuizPlayerContent spec
        const rawQuestions: any[] = JSON.parse(snapshotStr)
        if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
          throw new Error('Snapshot array is totally empty or malformed.')
        }

        const normalizedQuestions: QuizQuestion[] = rawQuestions.map(rq => ({
          questionId: rq.questionId,
          question: rq.question,
          marks: rq.marks || 1, // Fallback default if not defined in snapshot
          categoryId: rq.topicId || rq.categoryId || 0,
          categoryName: rq.topicName || rq.categoryName || 'General',
          questionSetId: rq.questionSetId || 0,
          questionSetTitle: rq.questionSetTitle || 'Generated Set',
          mcqImage: rq.mcqImage || null,
          options: (rq.options || []).map((o: any) => ({
            optionId: o.optionId,
            optionText: o.text || o.optionText || '?',
            optionImageUrl: o.optionImageUrl || o.imageUrl || null,
            correct: o.isCorrect === true || o.correct === true
          }))
        }))

        setQuestions(normalizedQuestions)
      } catch (e) {
        console.error('[CustomQuizStartPage] Failed parsing snapshot', e)
        setError('Failed to load quiz structure. It might be corrupt.')
      }
    }

    loadAttempt()
  }, [unwrappedParams])

  if (error || !questions) {
    return (
      <main className="flex-grow bg-gray-50 flex items-center justify-center p-6 min-h-screen">
        <div className="bg-white max-w-lg w-full border border-red-100 rounded-xl shadow-sm p-6 text-center">
          <div className="size-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
            <span className="material-symbols-outlined">error</span>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">Unable to Load Practice Set</h3>
          <p className="text-gray-600 text-sm mb-6">{error || 'Initializing engine...'}</p>
          <button
            onClick={() => router.push('/quiz')}
            className="px-6 py-2 bg-brand-navy hover:bg-brand-blue text-white font-bold rounded-lg transition-colors text-sm"
          >
            Go Back to Quizzes
          </button>
        </div>
      </main>
    )
  }

  return (
    <QuizPlayerContent
      questions={questions}
      quizTitle="Generated Practice Set"
      questionSetId={0} // Passed as zero, but attemptId handles routing logic
      attemptId={attemptId}
      onExit={() => router.push('/quiz')}
    />
  )
}
