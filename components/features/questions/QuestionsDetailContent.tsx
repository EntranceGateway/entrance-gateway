'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CenteredSpinner } from '@/components/shared/Loading'
import { SimplePDFViewer } from '@/components/shared/SimplePDFViewer'
import { useResourceFile } from '@/hooks/api/useResourceFile'
import { fetchOldQuestionById } from '@/services/client/questions.client'
import { useToast } from '@/components/shared/Toast'
import type { OldQuestion, OldQuestionDetailResponse } from '@/types/questions.types'

interface QuestionsDetailContentProps {
  questionId: string
  initialData?: OldQuestionDetailResponse | null
}

export function QuestionsDetailContent({ questionId, initialData }: QuestionsDetailContentProps) {
  const { showToast } = useToast()
  const [question, setQuestion] = useState<OldQuestion | null>(initialData?.data || null)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  // Fetch question data (skip if we have SSR data)
  useEffect(() => {
    // Skip if we already have initial data
    if (initialData) {
      return
    }

    const loadQuestion = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchOldQuestionById(questionId)
        setQuestion(response.data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load question'
        setError(errorMessage)
        showToast(errorMessage, 'error')
      } finally {
        setIsLoading(false)
      }
    }

    loadQuestion()
  }, [questionId, initialData, showToast])

  // Fetch PDF file using resource hook (pdfFilePath contains the file name)
  const {
    url: pdfUrl,
    isLoading: isPdfLoading,
    error: pdfError,
  } = useResourceFile(question?.pdfFilePath || null, {
    enabled: !!question?.pdfFilePath,
  })

  // Loading State
  if (isLoading) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <CenteredSpinner size="lg" text="Loading question..." />
        </div>
      </main>
    )
  }

  // Error State
  if (error || !question) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 text-red-600 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <div>
                <h3 className="font-bold text-lg text-red-900 mb-1">Failed to load question</h3>
                <p className="text-sm text-red-700">{error || 'Question not found'}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/questions"
                className="inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-900"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Back to Questions
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-grow">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="mb-4 sm:mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/questions" className="text-gray-500 hover:text-brand-navy transition-colors">
                Old Questions
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-brand-navy font-medium truncate">{question.setName}</li>
          </ol>
        </nav>

        {/* Main Content Grid - PDF First on Mobile */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* PDF Viewer - Full width on mobile, 8 cols on desktop */}
          <div className="w-full lg:col-span-8 order-1 flex flex-col gap-6">
            {/* PDF Viewer with Resource Hook */}
            <SimplePDFViewer
              pdfUrl={pdfUrl}
              isLoading={isPdfLoading}
              error={pdfError?.message || null}
            />
          </div>

          {/* Sidebar - Below PDF on mobile, 4 cols on desktop */}
          <aside className="w-full lg:col-span-4 order-2">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Question Details Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-brand-navy mb-4 font-heading">
                  Question Details
                </h2>

                <div className="space-y-4">
                  {/* Set Name */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Set Name</p>
                    <p className="font-semibold text-gray-900">{question.setName}</p>
                  </div>

                  {/* Subject */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Subject</p>
                    <p className="font-semibold text-gray-900">{question.subject}</p>
                  </div>

                  {/* Year */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Year</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      {question.year}
                    </span>
                  </div>

                  {/* Course */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Course</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {question.courseName}
                    </span>
                  </div>

                  {/* Affiliation */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Affiliation</p>
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-gray-400">
                        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                      </svg>
                      <span className="text-sm text-gray-700">{question.affiliation.replace(/_/g, ' ')}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {question.description && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Description</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{question.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Back Button */}
              <Link
                href="/questions"
                className="block w-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-brand-navy font-semibold py-3 px-4 rounded-lg transition-colors text-center"
              >
                ← Back to All Questions
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
