'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useToast } from '@/components/shared/Toast'
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
    // small delay so DOM has painted
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
  onExit: () => void
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export function QuizPlayerContent({ questions, quizTitle, onExit }: QuizPlayerContentProps) {
  const total = questions.length
  const { success, info } = useToast()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  // map questionId → chosen optionId
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

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
  const mathRef = useRenderMath([currentIndex, isSubmitted, selectedOptionId])

  /* ---------- total possible score ---------- */
  const totalMarks = questions.reduce((s, qn) => s + qn.marks, 0)
  const pct = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0

  /* ---------- handlers ---------- */

  const handleSelect = (optionId: number) => {
    if (isSubmitted) return
    setSelectedOptionId(optionId)
  }

  const handleSubmit = useCallback(() => {
    if (selectedOptionId === null) {
      info('Please select an option before submitting')
      return
    }
    setIsSubmitted(true)
    setAnswers((prev) => ({ ...prev, [q.questionId]: selectedOptionId }))

    const correct = q.options.find((o) => o.correct)
    if (correct && correct.optionId === selectedOptionId) {
      setScore((s) => s + q.marks)
    }
  }, [selectedOptionId, q, info])

  const handleNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1)
      setSelectedOptionId(null)
      setIsSubmitted(false)
    } else {
      setShowResults(true)
      const pctScore = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0
      if (pctScore >= 70) {
        success(`🎉 Quiz complete! You scored ${score}/${totalMarks} (${pctScore}%)`)
      } else {
        info(`Quiz complete! You scored ${score}/${totalMarks} (${pctScore}%)`)
      }
    }
  }, [currentIndex, total, score, totalMarks, success, info])

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      const prevQ = questions[prevIndex]
      const prevAnswer = answers[prevQ.questionId]
      setSelectedOptionId(prevAnswer ?? null)
      setIsSubmitted(prevAnswer !== undefined)
    }
  }, [currentIndex, questions, answers])

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedOptionId(null)
    setIsSubmitted(false)
    setAnswers({})
    setScore(0)
    setShowResults(false)
  }

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])



  /* ---------- results screen ---------- */
  if (showResults) {
    const feedback =
      pct >= 90 ? { emoji: '🏆', msg: 'Outstanding!', color: 'text-yellow-500' } :
      pct >= 70 ? { emoji: '🎉', msg: 'Great job!', color: 'text-green-600' } :
      pct >= 50 ? { emoji: '👍', msg: 'Good effort!', color: 'text-blue-600' } :
      pct >= 30 ? { emoji: '📚', msg: 'Keep practising!', color: 'text-orange-500' } :
                  { emoji: '💪', msg: 'Don\'t give up!', color: 'text-red-500' }

    return (
      <div className="fixed inset-0 z-[60] bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-slide-in">
          {/* Header ribbon */}
          <div className="bg-brand-navy p-6 text-center">
            <span className="text-5xl">{feedback.emoji}</span>
            <h2 className="text-white text-2xl font-bold font-heading mt-3">{feedback.msg}</h2>
            <p className="text-white/70 text-sm mt-1">{quizTitle}</p>
          </div>

          <div className="p-6 space-y-6 text-center">
            {/* Score circle */}
            <div className="mx-auto size-32 rounded-full border-4 border-brand-blue flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-brand-navy">{score}/{totalMarks}</span>
              <span className="text-xs text-gray-500 mt-1">Score</span>
            </div>

            {/* Percentage bar */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Accuracy</span>
                <span className={`font-bold ${feedback.color}`}>{pct}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-brand-blue transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            {(() => {
              const answeredCount = Object.keys(answers).length
              const correctCount = questions.filter(qn => {
                const chosen = answers[qn.questionId]
                if (chosen === undefined) return false
                return qn.options.find(o => o.correct)?.optionId === chosen
              }).length
              const incorrectCount = answeredCount - correctCount
              return (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-green-700 font-bold text-lg">{correctCount}</p>
                    <p className="text-green-600 text-xs">Correct</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-red-700 font-bold text-lg">{incorrectCount}</p>
                    <p className="text-red-600 text-xs">Incorrect</p>
                  </div>
                </div>
              )
            })()}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 rounded-lg border-2 border-brand-blue text-brand-blue font-bold text-sm hover:bg-brand-blue/5 transition-colors cursor-pointer"
              >
                Restart
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-3 rounded-lg bg-brand-navy text-white font-bold text-sm hover:bg-brand-blue transition-colors cursor-pointer"
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
  const correctOption = q.options.find((o) => o.correct)

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

        {/* Live score */}
        <div className="flex items-center gap-1.5 bg-brand-gold/15 px-3 py-1.5 rounded-full">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-brand-gold">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <span className="text-sm font-bold text-brand-navy">{score}</span>
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

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                const letter = LETTERS[idx] ?? '•'
                const isSelected = selectedOptionId === opt.optionId
                const isCorrectOpt = opt.correct
                const isWrongSelected = isSubmitted && isSelected && !isCorrectOpt

                let optClass = 'border-gray-200 hover:border-brand-blue/40 hover:bg-blue-50/40 cursor-pointer'

                if (isSelected && !isSubmitted) {
                  optClass = 'border-brand-blue bg-blue-50 ring-2 ring-brand-blue/20 cursor-pointer'
                }
                if (isSubmitted) {
                  if (isCorrectOpt) {
                    optClass = 'border-green-500 bg-green-50'
                  } else if (isWrongSelected) {
                    optClass = 'border-red-500 bg-red-50'
                  } else {
                    optClass = 'border-gray-200 opacity-60'
                  }
                }

                return (
                  <button
                    key={opt.optionId}
                    onClick={() => handleSelect(opt.optionId)}
                    disabled={isSubmitted}
                    className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all duration-150 ${optClass}`}
                  >
                    {/* Letter circle */}
                    <span
                      className={`shrink-0 size-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        isSubmitted && isCorrectOpt
                          ? 'bg-green-500 text-white'
                          : isWrongSelected
                            ? 'bg-red-500 text-white'
                            : isSelected
                              ? 'bg-brand-blue text-white'
                              : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isSubmitted && isCorrectOpt ? (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      ) : isWrongSelected ? (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                      ) : (
                        letter
                      )}
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
          {/* Back */}
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              currentIndex === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
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

          {/* Submit / Next */}
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOptionId === null}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                selectedOptionId === null
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-brand-navy text-white hover:bg-brand-blue shadow-md'
              }`}
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold bg-brand-blue text-white hover:bg-brand-navy shadow-md transition-all"
            >
              {currentIndex === total - 1 ? 'See Results' : 'Next'}
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
