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
      showError(err instanceof Error ? err.message : 'Unable to start practice set.')
      setIsGenerating(false) // Only stop generating if error happens
    }
  }

  const formatPrice = (price?: number) => {
    return price && price > 0 ? `NPR ${price.toLocaleString()}` : 'Free'
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2">
                    <div className="flex items-center text-gray-700">
                      <span className="material-symbols-outlined text-brand-blue mr-2 sm:mr-3 text-[18px] sm:text-[20px]">quiz</span>
                      <span className="font-medium text-sm sm:text-base">Questions</span>
                    </div>
                    <span className="text-brand-navy font-bold text-sm sm:text-base">
                      {template.config?.totalQuestions || '?'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2">
                    <div className="flex items-center text-gray-700">
                      <span className="material-symbols-outlined text-brand-blue mr-2 sm:mr-3 text-[18px] sm:text-[20px]">schedule</span>
                      <span className="font-medium text-sm sm:text-base">Duration</span>
                    </div>
                    <span className="text-brand-navy font-bold text-sm sm:text-base">
                      {template.config?.durationMinutes ?? '?'} Minutes
                    </span>
                  </div>
                  
                  {template.config?.enableNegativeMarking && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-red-50 rounded-lg gap-2 border border-red-100">
                      <div className="flex items-center text-red-700">
                        <span className="material-symbols-outlined mr-2 sm:mr-3 text-[18px] sm:text-[20px]">remove_circle</span>
                        <span className="font-medium text-sm sm:text-base">Negative Marking</span>
                      </div>
                      <span className="text-red-700 font-bold text-sm sm:text-base">
                        {template.config.negativeMarkValue || 0} marks/error
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-brand-gold/10 rounded-lg border border-brand-gold/30">
                    <div className="flex items-center text-gray-700">
                      <span className="material-symbols-outlined text-brand-gold mr-2 sm:mr-3 text-[18px] sm:text-[20px]">payments</span>
                      <span className="font-medium text-sm sm:text-base">Entry Fee</span>
                    </div>
                    <span className="text-brand-navy font-bold text-base sm:text-lg">
                      {formatPrice(template.entryFee)}
                    </span>
                  </div>
                </div>

                {/* Extended Constraints */}
                {template.config?.constraints && (
                  <div className="mb-6 p-4 border border-brand-lavender bg-white rounded-lg">
                    <h4 className="text-sm font-bold text-brand-navy mb-3 uppercase tracking-wide">Dynamic Generation Rules</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {template.config.constraints.noRepeatWithinDays > 0 && (
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
