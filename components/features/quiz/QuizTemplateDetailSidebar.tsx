'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/shared/Toast'
import { fetchQuizTemplateById, generateQuizAttempt } from '@/services/client/quizTemplate.client'
import type { QuizTemplate } from '@/types/quizTemplate.types'

interface QuizTemplateDetailSidebarProps {
  templateId: string | null
  isOpen: boolean
  onClose: () => void
}

export function QuizTemplateDetailSidebar({ templateId, isOpen, onClose }: QuizTemplateDetailSidebarProps) {
  const router = useRouter()
  const { success: showSuccess, error: showError } = useToast()
  
  const [template, setTemplate] = useState<QuizTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Disable body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Fetch full details when opened
  useEffect(() => {
    if (isOpen && templateId) {
      const loadTemplateDetails = async () => {
        setIsLoading(true)
        setError(null)
        try {
          const res = await fetchQuizTemplateById(templateId)
          if (res?.data) {
            setTemplate(res.data)
          } else {
            setError('Invalid template data received.')
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unable to load template details.')
        } finally {
          setIsLoading(false)
        }
      }
      loadTemplateDetails()
    } else if (!isOpen) {
      // Clear slightly after closing to prevent visual jump
      const timer = setTimeout(() => {
        setTemplate(null)
        setError(null)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen, templateId])

  const handleGenerate = async () => {
    if (!template) return
    
    setIsGenerating(true)
    try {
      const response = await generateQuizAttempt(template.templateId)
      
      if (!response?.data?.attemptId) {
        throw new Error('Invalid response: Missing attempt ID.')
      }

      showSuccess(response.message || 'Practice set generated! Loading...')
      
      router.push(`/quiz/attempt/${response.data.attemptId}/start`)
      // Not calling onClose here to prevent the sidebar snapping closed before the page route actually resolves
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to start practice set.'

      if (message.toLowerCase().includes('sign in') || message === 'UNAUTHORIZED') {
        sessionStorage.setItem('redirectAfterLogin', '/quiz')
        showError('Please sign in to start this quiz.')
        router.push('/signin')
        return
      }

      showError(message)
      setIsGenerating(false) // Only stop generating if error happens
    }
  }

  const formatPrice = (price?: number) => {
    return price && price > 0 ? `NPR ${price.toLocaleString()}` : 'Free'
  }

  const formatDate = (value?: string) => {
    if (!value) return 'Not available'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Not available'
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDifficultyLabel = (value: string) => {
    return value
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const renderDistributionValue = (count: number, totalQuestions?: number) => {
    if (!totalQuestions || totalQuestions <= 0) return `${count} questions`
    const percent = Math.round((count / totalQuestions) * 100)
    return `${count} questions · ${percent}%`
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[450px] lg:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-brand-navy">
              Practice Configuration
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content - Scrollable */}
          <article className="flex-grow overflow-y-auto p-4 sm:p-6 relative">
            {isLoading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-24 bg-gray-200 rounded w-full"></div>
                <div className="space-y-3">
                   <div className="h-16 bg-gray-100 rounded"></div>
                   <div className="h-16 bg-gray-100 rounded"></div>
                   <div className="h-16 bg-gray-100 rounded"></div>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                  <span className="material-symbols-outlined text-red-600">error</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Template</h3>
                <p className="text-sm text-gray-500 mb-6">{error}</p>
                {error === 'UNAUTHORIZED' && (
                  <button
                    onClick={() => {
                        sessionStorage.setItem('redirectAfterLogin', '/quiz')
                        router.push('/signin')
                    }}
                    className="bg-brand-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-blue"
                  >
                    Sign In
                  </button>
                )}
              </div>
            ) : template ? (
              <>
                {/* Category Badge */}
                <div className="mb-4 sm:mb-6">
                  <span className="inline-block bg-brand-lavender text-brand-purple text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {template.type} Set
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-brand-navy mb-3 sm:mb-4">
                  {template.name}
                </h3>

                {/* Description */}
                {template.description && template.description.trim() && (
                  <div className="mb-4 sm:mb-6">
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                      {template.description}
                    </p>
                  </div>
                )}

                {/* Core Config Details */}
                <div className="space-y-3 sm:space-y-4 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center text-gray-700 mb-2">
                        <span className="material-symbols-outlined text-brand-blue mr-2 text-[18px] sm:text-[20px]">quiz</span>
                        <span className="font-medium text-sm sm:text-base">Questions</span>
                      </div>
                      <span className="text-brand-navy font-bold text-lg">
                        {template.config?.totalQuestions ?? '?'}
                      </span>
                    </div>

                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center text-gray-700 mb-2">
                        <span className="material-symbols-outlined text-brand-blue mr-2 text-[18px] sm:text-[20px]">schedule</span>
                        <span className="font-medium text-sm sm:text-base">Duration</span>
                      </div>
                      <span className="text-brand-navy font-bold text-lg">
                        {template.config?.durationMinutes ?? '?'} min
                      </span>
                    </div>

                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center text-gray-700 mb-2">
                        <span className="material-symbols-outlined text-brand-blue mr-2 text-[18px] sm:text-[20px]">score</span>
                        <span className="font-medium text-sm sm:text-base">Total Marks</span>
                      </div>
                      <span className="text-brand-navy font-bold text-lg">
                        {template.config?.totalMarks ?? '?'}
                      </span>
                    </div>

                    <div className="p-3 sm:p-4 bg-brand-gold/10 rounded-lg border border-brand-gold/30">
                      <div className="flex items-center text-gray-700 mb-2">
                        <span className="material-symbols-outlined text-brand-gold mr-2 text-[18px] sm:text-[20px]">payments</span>
                        <span className="font-medium text-sm sm:text-base">Entry Fee</span>
                      </div>
                      <span className="text-brand-navy font-bold text-lg">
                        {formatPrice(template.entryFee)}
                      </span>
                    </div>
                  </div>

                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg gap-2 border ${
                    template.config?.enableNegativeMarking
                      ? 'bg-red-50 border-red-100'
                      : 'bg-green-50 border-green-100'
                  }`}>
                    <div className={`flex items-center ${template.config?.enableNegativeMarking ? 'text-red-700' : 'text-green-700'}`}>
                      <span className="material-symbols-outlined mr-2 sm:mr-3 text-[18px] sm:text-[20px]">
                        {template.config?.enableNegativeMarking ? 'remove_circle' : 'verified'}
                      </span>
                      <span className="font-medium text-sm sm:text-base">Negative Marking</span>
                    </div>
                    <span className={`font-bold text-sm sm:text-base ${template.config?.enableNegativeMarking ? 'text-red-700' : 'text-green-700'}`}>
                      {template.config?.enableNegativeMarking
                        ? `${template.config.negativeMarkValue ?? 0} marks/error`
                        : 'No'}
                    </span>
                  </div>

                  {template.entranceType?.entranceName && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-brand-lavender/40 rounded-lg gap-2 border border-brand-lavender">
                      <div className="flex items-center text-gray-700">
                        <span className="material-symbols-outlined text-brand-purple mr-2 sm:mr-3 text-[18px] sm:text-[20px]">school</span>
                        <span className="font-medium text-sm sm:text-base">Entrance Type</span>
                      </div>
                      <span className="text-brand-navy font-bold text-sm sm:text-base">
                        {template.entranceType.entranceName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Difficulty Distribution */}
                {template.config?.difficultyDistribution && Object.keys(template.config.difficultyDistribution).length > 0 && (
                  <div className="mb-6 p-4 border border-gray-200 bg-white rounded-lg">
                    <h4 className="text-sm font-bold text-brand-navy mb-3 uppercase tracking-wide">Difficulty Distribution</h4>
                    <div className="space-y-3">
                      {Object.entries(template.config.difficultyDistribution).map(([difficulty, value]) => (
                        <div key={difficulty}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{formatDifficultyLabel(difficulty)}</span>
                            <span className="text-brand-navy font-semibold">{value}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-blue rounded-full"
                              style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topic Distribution */}
                {Array.isArray(template.config?.topicDistribution) && template.config.topicDistribution.length > 0 && (
                  <div className="mb-6 p-4 border border-gray-200 bg-white rounded-lg">
                    <h4 className="text-sm font-bold text-brand-navy mb-3 uppercase tracking-wide">Topic Distribution</h4>
                    <div className="space-y-3">
                      {template.config.topicDistribution.map((topic, index) => (
                        <div key={topic.topicId || `${topic.topicName}-${index}`} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-brand-navy">
                                {topic.topicName || `Topic ${index + 1}`}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {renderDistributionValue(topic.count, template.config?.totalQuestions)}
                              </p>
                            </div>
                            {topic.weightage > 0 && (
                              <span className="shrink-0 bg-brand-lavender text-brand-purple text-xs font-bold px-2 py-1 rounded-full">
                                {topic.weightage}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extended Constraints */}
                {template.config?.constraints && (
                  <div className="mb-6 p-4 border border-brand-lavender bg-white rounded-lg">
                    <h4 className="text-sm font-bold text-brand-navy mb-3 uppercase tracking-wide">Dynamic Generation Rules</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {(template.config.constraints.noRepeatWithinDays ?? 0) > 0 && (
                        <li className="flex gap-2">
                          <span className="material-symbols-outlined text-[18px] text-green-500">check_circle</span>
                          <span>Prioritizes unseen questions (last {template.config.constraints.noRepeatWithinDays} days)</span>
                        </li>
                      )}
                      {template.config.constraints.avoidPreviouslyFailed && (
                        <li className="flex gap-2">
                          <span className="material-symbols-outlined text-[18px] text-green-500">check_circle</span>
                          <span>Excludes questions you recently failed or guessed</span>
                        </li>
                      )}
                      <li className="flex gap-2">
                        <span className="material-symbols-outlined text-[18px] text-brand-gold">auto_awesome</span>
                        <span>Calculated instantly matching exam syllabus weighting</span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Metadata */}
                <div className="mb-6 p-4 border border-gray-200 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-bold text-brand-navy mb-3 uppercase tracking-wide">Template Metadata</h4>
                  <dl className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Created</dt>
                      <dd className="text-brand-navy font-medium text-right">{formatDate(template.createdAt)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Updated</dt>
                      <dd className="text-brand-navy font-medium text-right">{formatDate(template.updatedAt)}</dd>
                    </div>
                    {(template.createdByName || template.createdBy) && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500">Created By</dt>
                        <dd className="text-brand-navy font-medium text-right">{template.createdByName || template.createdBy}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {template.entryFee > 0 && (
                  <div className="mb-6 p-4 bg-brand-gold/10 border border-brand-gold/30 rounded-lg">
                    <div className="flex gap-3">
                      <span className="material-symbols-outlined text-brand-gold text-[20px]">info</span>
                      <p className="text-sm text-gray-700">
                        This is a paid template. Access may require purchase, enrollment, or an active subscription before generation.
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </article>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 border-t border-gray-200 flex-shrink-0 bg-white">
            <button
              onClick={handleGenerate}
              disabled={isLoading || isGenerating || !template || !!error}
              className="w-full flex items-center justify-center gap-2 bg-brand-navy hover:bg-brand-blue text-white font-bold py-3 px-4 rounded-lg transition-colors focus-brand disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="inline-block size-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                  <span>Preparing Your Set...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                  <span>Generate Practice Set</span>
                </>
              )}
            </button>
            <p className="text-xs text-center text-gray-500 mt-3 flex items-center justify-center gap-1">
               <span className="material-symbols-outlined text-[14px]">lock</span>
               Secure mock environment
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
