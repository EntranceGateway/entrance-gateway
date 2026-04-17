'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useToast } from '@/components/shared/Toast'
import { submitQuizAttempt, submitGeneratedAttempt } from '@/services/client/quizAttempt.client'
import type { QuizAttemptResult } from '@/services/client/quizAttempt.client'
import type { QuizQuestion } from '@/types/quiz-player.types'

/* ------------------------------------------------------------------ */
/*  KaTeX auto-render helper                                          */
/* ------------------------------------------------------------------ */
declare global {
  interface Window {
    renderMathInElement?: (
      el: HTMLElement,
      opts?: Record<string, unknown>
    ) => void
  }
}

const KATEX_OPTIONS = {
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false },
    { left: '\\(', right: '\\)', display: false },
    { left: '\\[', right: '\\]', display: true },
  ],
  throwOnError: false,
}

function useRenderMath(deps: unknown[]) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el || !window.renderMathInElement) return
    const id = requestAnimationFrame(() => {
      window.renderMathInElement?.(el, KATEX_OPTIONS)
    })
    return () => cancelAnimationFrame(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return containerRef
}

/* ------------------------------------------------------------------ */
/*  Category color palette                                            */
/* ------------------------------------------------------------------ */
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Science:    { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  Math:       { bg: 'bg-blue-100',    text: 'text-blue-800',    border: 'border-blue-300' },
  English:    { bg: 'bg-purple-100',  text: 'text-purple-800',  border: 'border-purple-300' },
  Physics:    { bg: 'bg-orange-100',  text: 'text-orange-800',  border: 'border-orange-300' },
  Chemistry:  { bg: 'bg-teal-100',    text: 'text-teal-800',    border: 'border-teal-300' },
  Biology:    { bg: 'bg-lime-100',    text: 'text-lime-800',    border: 'border-lime-300' },
  Computer:   { bg: 'bg-indigo-100',  text: 'text-indigo-800',  border: 'border-indigo-300' },
  GK:         { bg: 'bg-rose-100',    text: 'text-rose-800',    border: 'border-rose-300' },
}
const DEFAULT_CAT = { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' }

function catColor(name: string) {
  return CATEGORY_COLORS[name] ?? DEFAULT_CAT
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

/* ------------------------------------------------------------------ */
/*  Props                                                             */
/* ------------------------------------------------------------------ */
interface QuizPlayerContentProps {
  questions: QuizQuestion[]
  quizTitle: string
  questionSetId: number
  attemptId?: number
  onExit: () => void
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export function QuizPlayerContent({ questions, quizTitle, questionSetId, attemptId, onExit }: QuizPlayerContentProps) {
  const total = questions.length
  const { success, error: showError, info } = useToast()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null)
  // map questionId → chosen optionId
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverResult, setServerResult] = useState<QuizAttemptResult | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Guard against empty questions array
  if (total === 0) {
    return (
      <div className="fixed inset-0 z-[60] bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-brand-navy mb-2">No questions available</h2>
          <p className="text-gray-600 text-sm mb-6">This quiz has no questions yet.</p>
          <button onClick={onExit} className="px-6 py-2.5 bg-brand-navy text-white font-bold rounded-lg hover:bg-brand-blue transition-colors text-sm cursor-pointer">Go Back</button>
        </div>
      </div>
    )
  }

  const q = questions[currentIndex]
  const progress = ((currentIndex + 1) / total) * 100

  // Render LaTeX each time the question changes
  const mathRef = useRenderMath([currentIndex, selectedOptionId])

  /* ---------- handlers ---------- */

  const handleSelect = (optionId: number) => {
    setSelectedOptionId(optionId)
  }

  const handleNextOrFinish = useCallback(() => {
    // Save answer for current question (null means skipped)
    const updatedAnswers = { ...answers }
    if (selectedOptionId !== null) {
      updatedAnswers[q.questionId] = selectedOptionId
    } else {
      delete updatedAnswers[q.questionId] // ensure it's removed if they unselected
    }
    setAnswers(updatedAnswers)

    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1)
      const nextQ = questions[currentIndex + 1]
      const savedAnswer = updatedAnswers[nextQ.questionId]
      setSelectedOptionId(savedAnswer ?? null)
    } else {
      // Last question — submit to API
      setShowResults(true)
      setIsSubmitting(true)
      setSubmitError(null)

      const questionAnswers = questions.map((qn) => ({
        questionId: qn.questionId,
        selectedOptionId: updatedAnswers[qn.questionId] ?? null,
      }))

      if (attemptId !== undefined && attemptId !== 0) {
        submitGeneratedAttempt(attemptId, { questionSetId, questionAnswers })
          .then((response) => {
            // Map the minimal generated attempting result into the existing UI shape
            const derivedPct = questions.length > 0 ? (response.data.score / questions.length) * 100 : 0
            setServerResult({
              totalScore: response.data.score,
              percentage: derivedPct,
              status: derivedPct >= 60 ? 'PASSED' : 'FAILED',
              totalQuestions: questions.length,
              correctAnswers: undefined as unknown as number, // Let client strictly calculate via ??
              wrongAnswers: undefined as unknown as number,
              skippedAnswers: undefined as unknown as number,
              rank: 0,
              percentile: 0
            })
            success(`Practice Set Submitted. You scored ${response.data.score}!`)
          })
          .catch((err) => {
            const msg = err instanceof Error ? err.message : 'Failed to submit practice set.'
            setSubmitError(msg)
            showError(msg)
          })
          .finally(() => setIsSubmitting(false))

      } else {
        submitQuizAttempt({ questionSetId, questionAnswers })
          .then((response) => {
            setServerResult(response.data)
            if (response.data.percentage >= 70) {
              success(`🎉 ${response.data.status}! You scored ${response.data.totalScore} (${response.data.percentage}%)`)
            } else {
              info(`Quiz complete! You scored ${response.data.totalScore} (${response.data.percentage}%)`)
            }
          })
          .catch((err) => {
            const msg = err instanceof Error ? err.message : 'Failed to submit quiz. Please try again.'
            setSubmitError(msg)
            showError(msg)
          })
          .finally(() => setIsSubmitting(false))
      }
    }
  }, [selectedOptionId, q, currentIndex, total, questions, answers, questionSetId, attemptId, info, success, showError])

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      // Save current selection before going back (if user picked something)
      if (selectedOptionId !== null) {
        setAnswers((prev) => ({ ...prev, [q.questionId]: selectedOptionId }))
      }
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      const prevQ = questions[prevIndex]
      const prevAnswer = answers[prevQ.questionId]
      setSelectedOptionId(prevAnswer ?? null)
    }
  }, [currentIndex, questions, answers, selectedOptionId, q])

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedOptionId(null)
    setAnswers({})
    setShowResults(false)
  }

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  /* ---------- results screen ---------- */
  if (showResults) {
    // Use server results if available, otherwise calculate client-side as fallback
    const totalMarks = questions.reduce((s, qn) => s + qn.marks, 0)
    let clientScore = 0
    let clientCorrect = 0
    questions.forEach((qn) => {
      const chosen = answers[qn.questionId]
      if (chosen === undefined) return
      const correctOpt = qn.options.find((o) => o.correct)
      if (correctOpt && correctOpt.optionId === chosen) {
        clientScore += qn.marks
        clientCorrect++
      }
    })
    const answeredCount = Object.keys(answers).length
    const clientIncorrect = answeredCount - clientCorrect

    // For standard quizzes we prefer server results. For custom quizzes, the server just gives total score,
    // so we merge server's total score with client's correctly computed detailed metrics smoothly.
    const correctCount = serverResult?.correctAnswers ?? clientCorrect
    const incorrectCount = serverResult?.wrongAnswers ?? clientIncorrect
    const skippedCount = serverResult?.skippedAnswers ?? (total - answeredCount)
    const score = serverResult?.totalScore ?? clientScore
    const pct = typeof serverResult?.percentage === 'number' && serverResult.percentage > 0 
                  ? Math.round(serverResult.percentage) 
                  : (totalMarks > 0 ? Math.round((clientScore / totalMarks) * 100) : 0)

    const feedback =
      pct >= 90 ? { emoji: '🏆', msg: 'Outstanding!', color: 'text-yellow-500' } :
      pct >= 70 ? { emoji: '🎉', msg: 'Great job!', color: 'text-green-600' } :
      pct >= 50 ? { emoji: '👍', msg: 'Good effort!', color: 'text-blue-600' } :
      pct >= 30 ? { emoji: '📚', msg: 'Keep practising!', color: 'text-orange-500' } :
                  { emoji: '💪', msg: 'Don\'t give up!', color: 'text-red-500' }

    return (
      <div className="fixed inset-0 z-[60] bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-brand-navy px-4 py-4 text-center shrink-0">
          <span className="text-4xl">{feedback.emoji}</span>
          <h2 className="text-white text-xl font-bold font-heading mt-2">{feedback.msg}</h2>
          <p className="text-white/70 text-sm mt-1">{quizTitle}</p>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            {/* Submitting indicator */}
            {isSubmitting && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center">
                <div className="animate-spin size-6 border-2 border-brand-blue border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-sm text-blue-700 font-medium">Submitting your quiz...</p>
              </div>
            )}

            {/* Submit error */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            {/* Score summary */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
              <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 mb-4">
                <div className="text-center">
                  <span className="text-2xl sm:text-3xl font-bold text-brand-navy">{score}</span>
                  <p className="text-xs text-gray-500 mt-1">Score</p>
                </div>
                <div className="w-px h-10 sm:h-12 bg-gray-200" />
                <div className="text-center">
                  <span className={`text-2xl sm:text-3xl font-bold ${feedback.color}`}>{pct}%</span>
                  <p className="text-xs text-gray-500 mt-1">Accuracy</p>
                </div>
                {serverResult?.rank && (
                  <>
                    <div className="w-px h-10 sm:h-12 bg-gray-200" />
                    <div className="text-center">
                      <span className="text-2xl sm:text-3xl font-bold text-brand-blue">#{serverResult.rank}</span>
                      <p className="text-xs text-gray-500 mt-1">Rank</p>
                    </div>
                  </>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="h-2.5 rounded-full bg-brand-blue transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Server status badge */}
              {serverResult?.status && (
                <div className="text-center mb-4">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
                    serverResult.status === 'PASSED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {serverResult.status}
                  </span>
                  {serverResult.percentile > 0 && (
                    <p className="text-xs text-gray-500 mt-2">You scored better than {serverResult.percentile}% of participants</p>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 text-sm">
                <div className="bg-green-50 rounded-lg p-2 sm:p-3 text-center">
                  <p className="text-green-700 font-bold text-base sm:text-lg">{correctCount}</p>
                  <p className="text-green-600 text-[10px] sm:text-xs">Correct</p>
                </div>
                <div className="bg-red-50 rounded-lg p-2 sm:p-3 text-center">
                  <p className="text-red-700 font-bold text-base sm:text-lg">{incorrectCount}</p>
                  <p className="text-red-600 text-[10px] sm:text-xs">Incorrect</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
                  <p className="text-gray-700 font-bold text-base sm:text-lg">{skippedCount}</p>
                  <p className="text-gray-600 text-[10px] sm:text-xs">Skipped</p>
                </div>
              </div>
            </div>

            {/* Question-by-question review */}
            <h3 className="text-lg font-bold text-brand-navy mb-4 font-heading">Question Review</h3>
            <div className="space-y-4">
              {questions.map((qn, qIdx) => {
                const userAnswer = answers[qn.questionId]
                const correctOpt = qn.options.find((o) => o.correct)
                const isCorrect = userAnswer !== undefined && correctOpt?.optionId === userAnswer
                const isSkipped = userAnswer === undefined

                return (
                  <div key={qn.questionId} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Question header */}
                    <div className={`px-3 sm:px-4 py-2.5 sm:py-3 flex items-start gap-2 ${
                      isSkipped ? 'bg-gray-50' : isCorrect ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      <span className={`size-5 sm:size-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white shrink-0 mt-0.5 ${
                        isSkipped ? 'bg-gray-400' : isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {isSkipped ? '–' : isCorrect ? '✓' : '✗'}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-800 shrink-0">Q{qIdx + 1}.</span>
                      <span className="text-xs sm:text-sm text-gray-700 flex-1 break-words">{qn.question}</span>
                      <span className="text-[10px] sm:text-xs font-medium text-gray-500 shrink-0">{qn.marks} {qn.marks === 1 ? 'mk' : 'mks'}</span>
                    </div>

                    {/* Options review */}
                    <div className="px-3 sm:px-4 py-2 sm:py-3 space-y-1.5 sm:space-y-2">
                      {qn.options.map((opt, oIdx) => {
                        const letter = LETTERS[oIdx] ?? '•'
                        const isUserChoice = userAnswer === opt.optionId
                        const isCorrectOption = opt.correct

                        let optStyle = 'border-gray-100 text-gray-600'
                        if (isCorrectOption) {
                          optStyle = 'border-green-300 bg-green-50 text-green-800'
                        } else if (isUserChoice && !isCorrectOption) {
                          optStyle = 'border-red-300 bg-red-50 text-red-800'
                        }

                        return (
                          <div
                            key={opt.optionId}
                            className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border text-xs sm:text-sm ${optStyle}`}
                          >
                            <span className={`size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              isCorrectOption
                                ? 'bg-green-500 text-white'
                                : isUserChoice
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-100 text-gray-500'
                            }`}>
                              {isCorrectOption ? '✓' : isUserChoice ? '✗' : letter}
                            </span>
                            <span className="flex-1">{opt.optionText}</span>
                            {isUserChoice && (
                              <span className="text-xs font-medium opacity-70">Your answer</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pb-4">
              <button
                onClick={handleRestart}
                disabled={isSubmitting}
                className={`flex-1 py-3 rounded-lg border-2 border-brand-blue text-brand-blue font-bold text-sm transition-colors ${
                  isSubmitting 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-brand-blue/5 cursor-pointer'
                }`}
              >
                Restart
              </button>
              <button
                onClick={onExit}
                disabled={isSubmitting}
                className={`flex-1 py-3 rounded-lg bg-brand-navy text-white font-bold text-sm transition-colors ${
                  isSubmitting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-brand-blue cursor-pointer'
                }`}
              >
                Exit Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- question screen ---------- */
  const cat = catColor(q.categoryName)
  // Count how many questions have been answered so far
  const answeredSoFar = Object.keys(answers).length

  return (
    <div className="fixed inset-0 z-[60] bg-gray-50 flex flex-col" ref={mathRef}>
      {/* ===== HEADER ===== */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
          <span className="hidden sm:inline">Exit</span>
        </button>

        <h1 className="text-sm sm:text-base font-bold text-brand-navy truncate max-w-[40%] font-heading">
          {quizTitle}
        </h1>

        {/* Answered count */}
        <div className="flex items-center gap-1.5 bg-brand-gold/15 px-3 py-1.5 rounded-full">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-brand-gold">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <span className="text-sm font-bold text-brand-navy">{answeredSoFar}/{total}</span>
        </div>
      </header>

      {/* ===== PROGRESS BAR ===== */}
      <div className="w-full bg-gray-200 h-1.5 shrink-0">
        <div
          className="h-1.5 bg-brand-blue transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ===== SCROLLABLE BODY ===== */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
          {/* Question card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 mb-6">
            {/* Top row: category + question meta */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
                {q.categoryName}
              </span>
              <span className="text-xs text-gray-400 ml-auto">
                Q{currentIndex + 1}/{total}
              </span>
              <span className="text-[11px] font-medium text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded">
                {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
              </span>
            </div>

            {/* Question text */}
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 leading-relaxed mb-4">
              {q.question}
            </h2>

            {/* Optional question image */}
            {q.mcqImage && (
              <div className="mb-4 rounded-lg overflow-hidden border border-gray-100">
                <img
                  src={q.mcqImage}
                  alt="Question illustration"
                  className="w-full max-h-64 object-contain bg-gray-50"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}

            {/* Options — NO correct/incorrect reveal */}
            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                const letter = LETTERS[idx] ?? '•'
                const isSelected = selectedOptionId === opt.optionId

                const optClass = isSelected
                  ? 'border-brand-blue bg-blue-50 ring-2 ring-brand-blue/20 cursor-pointer'
                  : 'border-gray-200 hover:border-brand-blue/40 hover:bg-blue-50/40 cursor-pointer'

                return (
                  <button
                    key={opt.optionId}
                    onClick={() => handleSelect(opt.optionId)}
                    className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all duration-150 ${optClass}`}
                  >
                    {/* Letter circle */}
                    <span
                      className={`shrink-0 size-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        isSelected
                          ? 'bg-brand-blue text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {letter}
                    </span>

                    {/* Option content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      {opt.optionImageUrl && (
                        <img
                          src={opt.optionImageUrl}
                          alt={`Option ${letter}`}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 mb-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      )}
                      <span className="text-sm sm:text-base text-gray-800">{opt.optionText}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ===== FOOTER NAV ===== */}
      <footer className="bg-white border-t border-gray-200 px-4 py-3 shrink-0 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          {/* Back — allows changing answer */}
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              currentIndex === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back
          </button>

          {/* Question counter */}
          <span className="text-xs text-gray-400 font-medium">
            {currentIndex + 1} of {total}
          </span>

          {/* Next / Finish */}
          <button
            onClick={handleNextOrFinish}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold bg-brand-navy text-white hover:bg-brand-blue shadow-md cursor-pointer transition-all"
          >
            {currentIndex === total - 1 ? 'Finish' : 'Next'}
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  )
}
