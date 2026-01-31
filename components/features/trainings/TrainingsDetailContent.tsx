'use client'

import { useState, useEffect } from 'react'
import { TrainingsDetailHero } from './TrainingsDetailHero'
import { TrainingsDetailSidebar } from './TrainingsDetailSidebar'
import { CenteredSpinner } from '@/components/shared/Loading'
import { fetchTrainingById } from '@/services/client/trainings.client'
import type { Training, TrainingDetailResponse } from '@/types/trainings.types'

interface TrainingsDetailContentProps {
  trainingId: string
  initialData?: TrainingDetailResponse | null
}

export function TrainingsDetailContent({ trainingId, initialData }: TrainingsDetailContentProps) {
  const [training, setTraining] = useState<Training | null>(initialData?.data || null)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  // Fetch training data (skip if we have SSR data)
  useEffect(() => {
    // Skip if we already have initial data
    if (initialData) {
      return
    }

    const loadTraining = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchTrainingById(trainingId)
        setTraining(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load training')
        console.error('Error fetching training:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadTraining()
  }, [trainingId, initialData])

  const handleRegister = () => {
    // TODO: Implement registration logic
    console.log('Register for training:', training?.trainingId)
  }

  const handleDownloadMaterials = () => {
    if (training?.materialsLink) {
      window.open(training.materialsLink, '_blank')
    }
  }

  // Loading State
  if (isLoading) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <CenteredSpinner size="lg" text="Loading training details..." />
        </div>
      </main>
    )
  }

  // Error State
  if (error || !training) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-semantic-error/10 border border-semantic-error text-semantic-error p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <div>
                <h3 className="font-bold text-lg mb-1">Failed to load training</h3>
                <p className="text-sm">{error || 'Training not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Parse syllabus description into bullet points
  const syllabusPoints = training.syllabusDescription
    ? training.syllabusDescription.split(/[,;]/).map(point => point.trim()).filter(Boolean)
    : []

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <TrainingsDetailHero training={training} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4 font-heading">
                About this Training
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {training.description}
              </p>

              {/* Syllabus and Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Course Syllabus */}
                {syllabusPoints.length > 0 && (
                  <div className="p-5 border border-gray-100 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-blue">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                      </svg>
                      <h3 className="font-bold text-gray-900">Course Syllabus</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {syllabusPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-brand-blue font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Learning Highlights */}
                <div className="p-5 border border-brand-blue/10 bg-brand-blue/5 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-blue">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <h3 className="font-bold text-gray-900">Learning Highlights</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Engage in interactive workshops, real-world case studies, and hands-on simulation sessions.
                  </p>
                </div>
              </div>

              {/* Download Materials Button */}
              {training.materialsLink && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleDownloadMaterials}
                    className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-navy font-medium text-sm transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                    </svg>
                    Download Course Materials
                  </button>
                </div>
              )}
            </section>

            {/* Who Should Attend Section */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-4 font-heading">
                Who Should Attend?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                This training is ideal for professionals looking to enhance their skills in {training.trainingCategory.toLowerCase()}. 
                Whether you're a beginner or have some experience, this program will help you advance your career.
              </p>
            </section>

            {/* Remarks Section */}
            {training.remarks && (
              <section className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-blue shrink-0 mt-0.5">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-brand-navy mb-1">Additional Information</h3>
                    <p className="text-sm text-gray-700">{training.remarks}</p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div>
            <TrainingsDetailSidebar training={training} onRegister={handleRegister} />
          </div>
        </div>
      </div>
    </main>
  )
}
