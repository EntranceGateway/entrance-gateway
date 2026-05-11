import type { QuizHistoryItem } from '@/services/client/quizAttempt.client'

interface QuizHistoryCardProps {
  item: QuizHistoryItem
  onClick?: () => void
}

interface TopicPerformanceEntry {
  topicName?: string
  totalQuestions?: number
  correctQuestions?: number
  percentage?: number
}

function formatNumber(value: number, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : '0.00'
}

function hasValue<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

function parseTopicPerformance(value?: string | null): TopicPerformanceEntry[] {
  if (!value) return []

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function QuizHistoryCard({ item, onClick }: QuizHistoryCardProps) {
  const displayName = item.quizName || item.quizTemplateName || 'Untitled quiz'
  const hasPercentage = hasValue(item.percentage)
  const percentage = hasPercentage ? Math.max(0, Math.min(100, Number(item.percentage) || 0)) : null
  const hasCorrectAnswers = hasValue(item.correctAnswers)
  const hasWrongAnswers = hasValue(item.wrongAnswers)
  const hasSkippedAnswers = hasValue(item.skippedAnswers)
  const hasTotalQuestions = hasValue(item.totalQuestions)
  const hasTotalScore = hasValue(item.totalScore)
  const hasTimeTaken = hasValue(item.timeTakenSeconds)
  const hasAttemptStats = hasCorrectAnswers || hasWrongAnswers || hasSkippedAnswers

  const correctAnswers = Number(item.correctAnswers) || 0
  const wrongAnswers = Number(item.wrongAnswers) || 0
  const skippedAnswers = Number(item.skippedAnswers) || 0
  const totalQuestions = Number(item.totalQuestions) || 0
  const attemptedQuestions = Math.max(0, totalQuestions - skippedAnswers)
  const correctRate = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
  const wrongRate = totalQuestions > 0 ? (wrongAnswers / totalQuestions) * 100 : 0
  const skippedRate = totalQuestions > 0 ? (skippedAnswers / totalQuestions) * 100 : 0
  const topicPerformance = parseTopicPerformance(item.topicPerformanceJson).slice(0, 2)

  const formattedDate = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(item.attemptedAt))

  const formatDuration = (totalSeconds: number) => {
    const safeSeconds = Math.max(0, Number(totalSeconds) || 0)
    const hours = Math.floor(safeSeconds / 3600)
    const minutes = Math.floor((safeSeconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const status = item.status?.toUpperCase()
  const isPassed = status === 'PASSED' || (percentage !== null && percentage >= 60)
  const scoreBasis = percentage ?? 0
  const scoreTone = scoreBasis >= 80 ? 'emerald' : scoreBasis >= 60 ? 'blue' : 'orange'
  const toneClasses = {
    emerald: {
      ring: 'text-emerald-600',
      bg: 'from-emerald-500 to-teal-500',
      soft: 'bg-emerald-50 text-emerald-700',
    },
    blue: {
      ring: 'text-brand-blue',
      bg: 'from-brand-blue to-brand-purple',
      soft: 'bg-blue-50 text-blue-700',
    },
    orange: {
      ring: 'text-orange-500',
      bg: 'from-orange-400 to-rose-400',
      soft: 'bg-orange-50 text-orange-700',
    },
  }[scoreTone]

  return (
    <article
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      } : undefined}
      data-role="quiz-history-item"
      data-history-id={item.id}
      className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${toneClasses.bg}`} />
      <div className="absolute -right-12 -top-12 size-32 rounded-full bg-brand-lavender/40 blur-2xl transition-transform group-hover:scale-125" />

      <div className="relative p-4 sm:p-5">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">Attempted</p>
            <p className="mt-1 text-xs font-semibold text-gray-500">{formattedDate}</p>
          </div>
          {status && (
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
              isPassed ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-red-100 bg-red-50 text-red-700'
            }`}>
              {status}
            </span>
          )}
        </div>

        <h3
          title={displayName}
          className="mb-4 sm:mb-5 min-h-0 sm:min-h-[3rem] max-w-full overflow-hidden break-words text-base sm:text-lg font-extrabold leading-snug text-brand-navy [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
        >
          {displayName}
        </h3>

        <div className="mb-4 sm:mb-5 flex flex-col items-center gap-4 sm:grid sm:grid-cols-[112px_1fr] sm:items-center">
          {percentage !== null && (
            <div className="relative size-28">
              <svg className="size-28 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="10" className="text-gray-100" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${percentage * 3.1416} 314.16`}
                  className={toneClasses.ring}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="text-xl font-black text-brand-navy">{formatNumber(percentage)}</div>
                  <div className="text-[10px] font-bold uppercase text-gray-400">Grade</div>
                </div>
              </div>
            </div>
          )}

          <div className={`w-full space-y-3 ${percentage === null ? 'sm:col-span-2' : ''}`}>
            {hasTotalScore && (
              <div className={`rounded-2xl px-3 py-2 ${toneClasses.soft}`}>
                <div className="text-[10px] font-black uppercase tracking-wider opacity-70">Score</div>
                <div className="text-sm font-black">{formatNumber(Number(item.totalScore))} pts</div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {hasTimeTaken && (
                <div className="rounded-2xl bg-gray-50 px-3 py-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Time</div>
                  <div className="text-sm font-black text-gray-700">{formatDuration(Number(item.timeTakenSeconds))}</div>
                </div>
              )}
              {hasTotalQuestions && (
                <div className="rounded-2xl bg-gray-50 px-3 py-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Done</div>
                  <div className="text-sm font-black text-gray-700">{attemptedQuestions}/{totalQuestions}</div>
                </div>
              )}
              {hasValue(item.currentRank) && (
                <div className="rounded-2xl bg-gray-50 px-3 py-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Rank</div>
                  <div className="text-sm font-black text-gray-700">#{item.currentRank}</div>
                </div>
              )}
              {hasValue(item.previousScore) && (
                <div className="rounded-2xl bg-gray-50 px-3 py-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Prev Score</div>
                  <div className="text-sm font-black text-gray-700">{formatNumber(Number(item.previousScore))}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {hasTotalQuestions && hasAttemptStats && (
          <div className="mb-4 overflow-hidden rounded-full bg-gray-100 h-2.5 flex">
            {hasCorrectAnswers && <div className="bg-emerald-500" style={{ width: `${correctRate}%` }} title={`${correctAnswers} correct`} />}
            {hasWrongAnswers && <div className="bg-rose-400" style={{ width: `${wrongRate}%` }} title={`${wrongAnswers} wrong`} />}
            {hasSkippedAnswers && <div className="bg-gray-300" style={{ width: `${skippedRate}%` }} title={`${skippedAnswers} skipped`} />}
          </div>
        )}

        {hasAttemptStats && (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
            {hasCorrectAnswers && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-2">
                <div className="text-base font-black text-emerald-700">{correctAnswers}</div>
                <div className="text-[10px] font-bold uppercase text-emerald-600/70">Correct</div>
              </div>
            )}
            {hasWrongAnswers && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-2">
                <div className="text-base font-black text-rose-600">{wrongAnswers}</div>
                <div className="text-[10px] font-bold uppercase text-rose-600/70">Wrong</div>
              </div>
            )}
            {hasSkippedAnswers && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-2">
                <div className="text-base font-black text-gray-600">{skippedAnswers}</div>
                <div className="text-[10px] font-bold uppercase text-gray-500">Skipped</div>
              </div>
            )}
          </div>
        )}

        {topicPerformance.length > 0 && (
          <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Topic performance</p>
            {topicPerformance.map((topic, index) => (
              <div key={`${topic.topicName}-${index}`} className="rounded-2xl bg-gray-50 p-3">
                <div className="mb-1 flex items-center justify-between gap-2 text-xs font-bold text-gray-700">
                  <span className="line-clamp-1">{topic.topicName || 'Topic'}</span>
                  {hasValue(topic.percentage) && <span>{formatNumber(Number(topic.percentage))}%</span>}
                </div>
                {hasValue(topic.percentage) && (
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-brand-blue" style={{ width: `${Math.max(0, Math.min(100, Number(topic.percentage) || 0))}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
