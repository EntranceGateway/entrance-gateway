'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/shared/Toast'
import {
  fetchAllTopics,
  fetchEntranceTypes,
  fetchTopicsByEntrance,
  generateCustomQuizAttempt,
  generateCustomQuizAttemptForEntrance,
} from '@/services/client/quizTemplate.client'
import type { Topic, CustomQuizPayload, EntranceType } from '@/types/quizTemplate.types'

interface QuizCustomPracticeSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function QuizCustomPracticeSidebar({ isOpen, onClose }: QuizCustomPracticeSidebarProps) {
  const router = useRouter()
  const { success: showSuccess, error: showError } = useToast()
  
  const [topics, setTopics] = useState<Topic[]>([])
  const [isLoadingTopics, setIsLoadingTopics] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [entranceTypes, setEntranceTypes] = useState<EntranceType[]>([])
  const [selectedEntranceSlug, setSelectedEntranceSlug] = useState('')

  // Form State
  const [totalQuestions, setTotalQuestions] = useState(50)
  const [totalMarks, setTotalMarks] = useState(50)
  const [durationMinutes, setDurationMinutes] = useState(60)
  const [enableNegativeMarking, setEnableNegativeMarking] = useState(false)
  const [negativeMarkValue, setNegativeMarkValue] = useState(0.25)
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
  const [topicCounts, setTopicCounts] = useState<Record<string, number>>({})
  const [difficultyDistribution, setDifficultyDistribution] = useState<Record<string, number>>({
    EASY: 30,
    MEDIUM: 50,
    HARD: 20,
  })
  
  // Advanced Constraints
  const [avoidPreviouslyFailed, setAvoidPreviouslyFailed] = useState(true)
  const [noRepeatWithinDays, setNoRepeatWithinDays] = useState(30)

  const topicsFetched = useRef(false)

  // Disable body scroll
  const loadTopics = useCallback(async (entranceSlug = selectedEntranceSlug) => {
    setIsLoadingTopics(true)
    setGlobalError(null)
    try {
      const [dbTopics, entranceList] = await Promise.all([
        entranceSlug ? fetchTopicsByEntrance(entranceSlug) : fetchAllTopics(),
        entranceTypes.length > 0 ? Promise.resolve(entranceTypes) : fetchEntranceTypes(),
      ])
      setTopics(dbTopics || [])
      setEntranceTypes(entranceList || [])
      topicsFetched.current = true
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Unable to load syllabus topics.')
    } finally {
      setIsLoadingTopics(false)
    }
  }, [entranceTypes, selectedEntranceSlug])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Fetch topics if we haven't already
      if (!topicsFetched.current) {
        loadTopics()
      }
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, loadTopics])

  const handleToggleTopic = (topicId: string) => {
    setSelectedTopicIds(prev => {
      if (prev.includes(topicId)) {
        setTopicCounts(current => {
          const next = { ...current }
          delete next[topicId]
          return next
        })
        return prev.filter(id => id !== topicId)
      }

      setTopicCounts(current => ({ ...current, [topicId]: Math.max(1, Math.floor(totalQuestions / Math.max(prev.length + 1, 1))) }))
      return [...prev, topicId]
    })
  }

  const handleEntranceChange = (slug: string) => {
    setSelectedEntranceSlug(slug)
    setSelectedTopicIds([])
    setTopicCounts({})
    topicsFetched.current = false
    loadTopics(slug)
  }

  const updateDifficulty = (key: 'EASY' | 'MEDIUM' | 'HARD', value: number) => {
    setDifficultyDistribution(prev => ({ ...prev, [key]: value }))
  }

  const allocatedQuestionTotal = selectedTopicIds.reduce((sum, topicId) => sum + (topicCounts[topicId] || 0), 0)
  const difficultyTotal = Object.values(difficultyDistribution).reduce((sum, value) => sum + value, 0)
  const isAllocationValid = selectedTopicIds.length > 0 && allocatedQuestionTotal === totalQuestions
  const isDifficultyValid = difficultyTotal === 100

  const handleGenerate = async () => {
    if (selectedTopicIds.length === 0) {
      showError('Please select at least one topic for your practice set.')
      return
    }

    if (!isAllocationValid) {
      showError(`Allocated topic questions must equal ${totalQuestions}. Current allocation is ${allocatedQuestionTotal}.`)
      return
    }

    if (!isDifficultyValid) {
      showError(`Difficulty distribution must total 100%. Current total is ${difficultyTotal}%.`)
      return
    }

    setIsGenerating(true)

    const payload: CustomQuizPayload = {
      totalQuestions,
      totalMarks,
      durationMinutes,
      enableNegativeMarking,
      negativeMarkValue: enableNegativeMarking ? negativeMarkValue : 0,
      difficultyDistribution,
      topicDistribution: selectedTopicIds.map(topicId => ({
        topicId,
        count: topicCounts[topicId] || 0,
        weightage: Math.round(((topicCounts[topicId] || 0) / totalQuestions) * 100),
      })),
      constraints: {
        avoidPreviouslyFailed,
        noRepeatWithinDays
      }
    }

    try {
      const response = selectedEntranceSlug
        ? await generateCustomQuizAttemptForEntrance(selectedEntranceSlug, payload)
        : await generateCustomQuizAttempt(payload)
      if (!response?.data?.attemptId) {
        throw new Error('Invalid response: Missing attempt ID.')
      }

      showSuccess(response.message || 'Custom practice set compiled! Loading...')
      router.push(`/quiz/attempt/${response.data.attemptId}/start`)
      setIsGenerating(false)
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Unable to compile custom practice set.')
      setIsGenerating(false)
    }
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
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[500px] lg:w-[600px] bg-gray-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-white border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-brand-navy">
              Custom Practice Set
            </h2>
            <p className="text-sm text-gray-500 mt-1">Configure your personalized quiz</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors bg-gray-50"
            aria-label="Close sidebar"
          >
            <span className="material-symbols-outlined text-gray-600">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6">
          {globalError === 'UNAUTHORIZED' ? (
             <div className="bg-white p-6 rounded-xl border border-red-100 text-center">
                <span className="material-symbols-outlined text-red-500 text-4xl mb-2">lock</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Sign Required</h3>
                <p className="text-sm text-gray-600 mb-4">You must be signed in to create custom practice sets.</p>
                <button
                  onClick={() => {
                      sessionStorage.setItem('redirectAfterLogin', '/quiz')
                      router.push('/signin')
                  }}
                  className="bg-brand-navy hover:bg-brand-blue text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  Sign In
                </button>
             </div>
          ) : (
            <>
              {/* Basic Config */}
              <section className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-brand-navy mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-brand-blue">tune</span>
                  Base Settings
                </h3>
                
                <div className="space-y-5">
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 mb-1">Entrance Type</span>
                    <select
                      value={selectedEntranceSlug}
                      onChange={(event) => handleEntranceChange(event.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                    >
                      <option value="">General / All Topics</option>
                      {entranceTypes.map((entrance) => (
                        <option key={entrance.entranceTypeId} value={entrance.slug}>
                          {entrance.entranceName}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div>
                    <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                      <span>Total Questions</span>
                      <span className="text-brand-blue font-bold">{totalQuestions}</span>
                    </label>
                    <input 
                      type="range" 
                      min="10" max="200" step="10"
                      value={totalQuestions} 
                      onChange={(e) => setTotalQuestions(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>10</span>
                      <span>200 (Max)</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                      <span>Total Marks</span>
                      <span className="text-brand-blue font-bold">{totalMarks}</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(Math.max(1, Number(e.target.value)))}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                    />
                  </div>

                  <div>
                    <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                      <span>Duration (Minutes)</span>
                      <span className="text-brand-blue font-bold">{durationMinutes}m</span>
                    </label>
                    <input 
                      type="range" 
                      min="10" max="180" step="10"
                      value={durationMinutes} 
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                    />
                  </div>
                </div>
              </section>

              {/* Difficulty Distribution */}
              <section className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-brand-navy mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-brand-blue">bar_chart</span>
                  Difficulty Distribution
                </h3>
                <p className={`text-xs mb-4 ${isDifficultyValid ? 'text-gray-500' : 'text-red-500'}`}>
                  Total must equal 100%. Current total: {difficultyTotal}%
                </p>
                <div className="space-y-4">
                  {(['EASY', 'MEDIUM', 'HARD'] as const).map((difficulty) => (
                    <div key={difficulty}>
                      <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                        <span>{difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}</span>
                        <span className="text-brand-blue font-bold">{difficultyDistribution[difficulty]}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={difficultyDistribution[difficulty]}
                        onChange={(e) => updateDifficulty(difficulty, Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Topics Selection */}
              <section className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-brand-navy mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-brand-purple">category</span>
                  Syllabus Topics
                </h3>
                <p className="text-xs text-gray-500 mb-4">Select topics and allocate exactly {totalQuestions} questions.</p>
                
                {isLoadingTopics ? (
                  <div className="animate-pulse flex gap-2 flex-wrap">
                    <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-32 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
                  </div>
                ) : globalError ? (
                  <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                    {globalError}
                  </div>
                ) : topics.length === 0 ? (
                  <div className="text-sm text-gray-500 italic">No topics available right now.</div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {topics.map(topic => {
                        const isSelected = selectedTopicIds.includes(topic.topicId)
                        return (
                          <button
                            key={topic.topicId}
                            onClick={() => handleToggleTopic(topic.topicId)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                              isSelected 
                                ? 'bg-brand-lavender border-brand-purple text-brand-purple shadow-sm' 
                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                            }`}
                          >
                            {topic.topicName}
                          </button>
                        )
                      })}
                    </div>

                    {selectedTopicIds.length > 0 && (
                      <div className="border-t border-gray-100 pt-4 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-brand-navy">Question Allocation</span>
                          <span className={isAllocationValid ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                            {allocatedQuestionTotal}/{totalQuestions}
                          </span>
                        </div>
                        {selectedTopicIds.map((topicId) => {
                          const topic = topics.find(item => item.topicId === topicId)
                          return (
                            <label key={topicId} className="flex items-center justify-between gap-3 text-sm">
                              <span className="text-gray-700 flex-1">{topic?.topicName || topicId}</span>
                              <input
                                type="number"
                                min="1"
                                max={totalQuestions}
                                value={topicCounts[topicId] || 1}
                                onChange={(event) => setTopicCounts(current => ({
                                  ...current,
                                  [topicId]: Math.max(1, Number(event.target.value)),
                                }))}
                                className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                              />
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Rules & Constraints */}
              <section className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-brand-navy flex items-center gap-2">
                  <span className="material-symbols-outlined text-brand-gold">gavel</span>
                  Rules & Spaced Repetition
                </h3>
                
                <label className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">Enable Negative Marking</span>
                    <span className="text-xs text-gray-500">Deducts custom marks per incorrect answer</span>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" checked={enableNegativeMarking} onChange={(e) => setEnableNegativeMarking(e.target.checked)} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                    <label className={`toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer ${enableNegativeMarking ? 'bg-brand-blue' : ''}`}></label>
                  </div>
                </label>

                {enableNegativeMarking && (
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 mb-1">Negative Mark Value</span>
                    <input
                      type="number"
                      min="0"
                      step="0.05"
                      value={negativeMarkValue}
                      onChange={(event) => setNegativeMarkValue(Math.max(0, Number(event.target.value)))}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                    />
                  </label>
                )}

                <label className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">Avoid Recently Failed</span>
                    <span className="text-xs text-gray-500">Exclude questions you recently failed or guessed</span>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" checked={avoidPreviouslyFailed} onChange={(e) => setAvoidPreviouslyFailed(e.target.checked)} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                    <label className={`toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer ${avoidPreviouslyFailed ? 'bg-brand-blue' : ''}`}></label>
                  </div>
                </label>
                
                <div>
                   <label className="flex justify-between text-sm font-medium text-gray-700 mb-1 mt-2">
                      <span>No Repeat Buffer (Days)</span>
                      <span className="font-bold text-gray-900">{noRepeatWithinDays}</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" max="60" step="5"
                      value={noRepeatWithinDays} 
                      onChange={(e) => setNoRepeatWithinDays(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Prevents seeing the exact same questions for this many days.</p>
                </div>
              </section>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-gray-200 bg-white">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || selectedTopicIds.length === 0 || !isAllocationValid || !isDifficultyValid || globalError === 'UNAUTHORIZED'}
            className="w-full flex items-center justify-center gap-2 bg-brand-navy hover:bg-brand-blue text-white font-bold py-3 px-4 rounded-lg transition-colors focus-brand disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
          >
            {isGenerating ? (
              <>
                <div className="inline-block size-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                <span>Compiling AI Set...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">psychology</span>
                <span>Compile Practice Set</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .toggle-checkbox:checked { right: 0; border-color: #68D391; }
        .toggle-checkbox:checked + .toggle-label { background-color: #1a365d; }
        .toggle-checkbox { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border-color: #E2E8F0; }
      `}} />
    </>
  )
}
