'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { fetchMySubscription } from '@/services/client/subscription.client'
import { initiateSubscriptionPayment, submitSubscriptionManualPaymentProof } from '@/services/client/payment.client'
import { fetchEntranceTypes } from '@/services/client/quizTemplate.client'
import { isAuthenticated } from '@/lib/auth/client'
import type {
  SubscriptionPlan,
  SubscriptionPlanResponse,
  SubscriptionStatusResponse,
} from '@/types/subscription.types'

interface SubscriptionEntranceOption {
  slug: string
  name: string
}

const fallbackSubscriptionEntranceOptions: SubscriptionEntranceOption[] = []

const fallbackPlans: SubscriptionPlanResponse[] = [
  {
    plan: 'SILVER',
    name: 'Silver',
    price: 299,
    durationDays: 30,
    maxQuizzesPerMonth: 30,
    maxQuestionsPerQuiz: 25,
    analyticsEnabled: false,
    mentorSupport: false,
    features: [
      '30 practice quizzes/month',
      'Basic analytics and quiz review',
      'Standard question access',
      'Mobile friendly practice',
    ],
  },
  {
    plan: 'GOLD',
    name: 'Gold',
    price: 599,
    durationDays: 30,
    maxQuizzesPerMonth: 999999,
    maxQuestionsPerQuiz: 50,
    analyticsEnabled: true,
    mentorSupport: false,
    features: [
      'Unlimited quizzes',
      'Advanced analytics',
      'Priority question access',
      'Performance insights',
      'Best for active preparation',
    ],
  },
  {
    plan: 'PREMIUM',
    name: 'Premium',
    price: 999,
    durationDays: 30,
    maxQuizzesPerMonth: 999999,
    maxQuestionsPerQuiz: 100,
    analyticsEnabled: true,
    mentorSupport: true,
    features: [
      'Unlimited quizzes',
      'Full premium question bank',
      'AI recommendations',
      'Advanced performance tracking',
      'Priority support',
      'Early access features',
    ],
  },
]

const planMeta: Record<SubscriptionPlan, {
  icon: string
  eyebrow: string
  summary: string
  quizLabel: string
  questionLabel: string
  gradient: string
  border: string
  button: string
  badge?: string
}> = {
  SILVER: {
    icon: 'bolt',
    eyebrow: 'Start steady',
    summary: 'A focused starter plan for learners who practice consistently without needing unlimited attempts.',
    quizLabel: '30 quizzes / month',
    questionLabel: '25 questions / quiz',
    gradient: 'from-slate-50 via-white to-slate-100',
    border: 'border-slate-200 hover:border-slate-300',
    button: 'bg-slate-900 text-white hover:bg-slate-700 focus-visible:ring-slate-400',
  },
  GOLD: {
    icon: 'workspace_premium',
    eyebrow: 'Most learners choose this',
    summary: 'Unlimited practice with stronger analytics for serious entrance preparation routines.',
    quizLabel: 'Unlimited quizzes',
    questionLabel: '50 questions / quiz',
    gradient: 'from-amber-50 via-white to-orange-50',
    border: 'border-amber-300 ring-2 ring-amber-200/80 shadow-amber-200/40',
    button: 'bg-brand-gold text-brand-navy hover:bg-[#FFD54F] focus-visible:ring-brand-gold',
    badge: 'Best value',
  },
  PREMIUM: {
    icon: 'auto_awesome',
    eyebrow: 'Maximum support',
    summary: 'The complete prep suite for learners who want deeper tracking, support, and early features.',
    quizLabel: 'Unlimited quizzes',
    questionLabel: '100 questions / quiz',
    gradient: 'from-indigo-50 via-white to-blue-50',
    border: 'border-brand-blue/30 hover:border-brand-blue/50',
    button: 'bg-brand-navy text-white hover:bg-brand-blue focus-visible:ring-brand-blue',
  },
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function formatQuizLimit(limit: number) {
  if (!Number.isFinite(limit) || limit >= 999999) return 'Unlimited'
  return `${limit}/month`
}

interface SubscriptionPlansContentProps {
  initialPlans?: SubscriptionPlanResponse[]
  initialSubscription?: SubscriptionStatusResponse | null
}

export function SubscriptionPlansContent({
  initialPlans = [],
  initialSubscription = null,
}: SubscriptionPlansContentProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [subscription, setSubscription] = useState<SubscriptionStatusResponse | null>(initialSubscription)
  const [loadingSubscription, setLoadingSubscription] = useState(false)
  const [processingPlan, setProcessingPlan] = useState<SubscriptionPlan | null>(null)
  const [entranceOptions, setEntranceOptions] = useState<SubscriptionEntranceOption[]>(fallbackSubscriptionEntranceOptions)
  const [selectedEntranceSlug, setSelectedEntranceSlug] = useState('')
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [manualPaymentPlan, setManualPaymentPlan] = useState<SubscriptionPlanResponse | null>(null)
  const [manualPaymentFile, setManualPaymentFile] = useState<File | null>(null)
  const [manualPaymentForm, setManualPaymentForm] = useState({
    amount: 0,
    remarks: '',
    transactionReference: '',
    userEmail: '',
  })
  const [isSubmittingManualPayment, setIsSubmittingManualPayment] = useState(false)

  const plans = useMemo(() => {
    const source = initialPlans.length > 0 ? initialPlans : fallbackPlans
    const order: SubscriptionPlan[] = ['SILVER', 'GOLD', 'PREMIUM']
    return [...source].sort((a, b) => order.indexOf(a.plan) - order.indexOf(b.plan))
  }, [initialPlans])

  useEffect(() => {
    let mounted = true

    async function refreshSubscriptionData() {
      setLoadingSubscription(true)
      try {
        const subscriptionData = await fetchMySubscription()
        if (mounted) setSubscription(subscriptionData)
      } catch {
        if (mounted) setSubscription(initialSubscription)
      } finally {
        if (mounted) setLoadingSubscription(false)
      }
    }

    refreshSubscriptionData()

    return () => {
      mounted = false
    }
  }, [initialSubscription])

  useEffect(() => {
    let mounted = true

    async function loadEntranceOptions() {
      try {
        const entrances = await fetchEntranceTypes()
        const options = entrances
          .filter((entrance) => Boolean(entrance.slug))
          .map((entrance) => ({
            slug: entrance.slug,
            name: entrance.entranceName || entrance.slug,
          }))

        if (!mounted) return

        setEntranceOptions(options)
        setSelectedEntranceSlug((currentSlug) => currentSlug || options[0]?.slug || '')
      } catch {
        if (!mounted) return
        setEntranceOptions(fallbackSubscriptionEntranceOptions)
        setSelectedEntranceSlug('')
      }
    }

    loadEntranceOptions()

    return () => {
      mounted = false
    }
  }, [])

  const hasActiveSubscription = Boolean(subscription?.isActive)
  const usagePercent = subscription?.quizzesLimitPerMonth && subscription.quizzesLimitPerMonth < 999999
    ? Math.min(100, Math.round((subscription.quizzesUsedThisMonth / subscription.quizzesLimitPerMonth) * 100))
    : 0

  const redirectToSignIn = () => {
    const redirect = encodeURIComponent(pathname || '/subscription')
    router.push(`/signin?redirect=${redirect}`)
  }

  const isUnauthorizedError = (error: unknown) => {
    if (!(error instanceof Error)) return false
    const message = error.message.toLowerCase()
    return message.includes('unauthorized') || message.includes('please login') || message.includes('please sign in')
  }

  async function handleSubscribe(plan: SubscriptionPlanResponse) {
    if (!selectedEntranceSlug) {
      setPaymentError('Please select a valid entrance type before subscribing.')
      return
    }

    setPaymentError(null)

    setProcessingPlan(plan.plan)
    try {
      const response = await initiateSubscriptionPayment({
        moduleId: plan.plan,
        moduleType: 'SUBSCRIPTION',
        amount: plan.price,
        paymentMethod: 'ESEWA',
        entranceTypeSlug: selectedEntranceSlug,
      })

      const redirectUrl = response.data?.paymentUrl || response.data?.redirectUrl
      if (redirectUrl) {
        const safeRedirectUrl = new URL(redirectUrl, window.location.origin)
        if (!['http:', 'https:'].includes(safeRedirectUrl.protocol)) {
          throw new Error('Invalid payment redirect URL.')
        }

        window.location.href = safeRedirectUrl.toString()
        return
      }

      await fetchMySubscription().then(setSubscription).catch(() => undefined)
    } catch (error) {
      if (isUnauthorizedError(error)) {
        redirectToSignIn()
        return
      }

      setPaymentError(error instanceof Error ? error.message : 'Payment initiation failed. Please try again.')
    } finally {
      setProcessingPlan(null)
    }
  }

  function handleOpenManualPayment(plan: SubscriptionPlanResponse) {
    if (!isAuthenticated()) {
      redirectToSignIn()
      return
    }

    setPaymentError(null)
    setManualPaymentPlan(plan)
    setManualPaymentFile(null)
    setManualPaymentForm({
      amount: plan.price,
      remarks: '',
      transactionReference: `MANUAL-${plan.plan}-${Date.now()}`,
      userEmail: '',
    })
  }

  async function handleSubmitManualPayment() {
    if (!manualPaymentPlan) return
    if (!manualPaymentForm.transactionReference.trim()) {
      setPaymentError('Please enter a transaction/reference number for manual payment.')
      return
    }

    const paymentAmount = Number(manualPaymentForm.amount)
    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      setPaymentError('Please enter a valid payment amount greater than zero.')
      return
    }

    setIsSubmittingManualPayment(true)
    setPaymentError(null)

    try {
      await submitSubscriptionManualPaymentProof(
        {
          id: manualPaymentPlan.plan,
          moduleId: manualPaymentPlan.plan,
          amount: paymentAmount,
          remarks: manualPaymentForm.remarks.trim() || 'Manual subscription payment submitted from dashboard',
          transactionReference: manualPaymentForm.transactionReference.trim(),
          userEmail: manualPaymentForm.userEmail.trim() || undefined,
          idempotencyKey: crypto.randomUUID(),
          entranceTypeSlug: selectedEntranceSlug || null,
        },
        manualPaymentFile
      )

      setManualPaymentPlan(null)
      setManualPaymentFile(null)
      await fetchMySubscription().then(setSubscription).catch(() => undefined)
    } catch (error) {
      if (isUnauthorizedError(error)) {
        setManualPaymentPlan(null)
        redirectToSignIn()
        return
      }

      setPaymentError(error instanceof Error ? error.message : 'Manual payment submission failed. Please try again.')
    } finally {
      setIsSubmittingManualPayment(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F9FC] text-brand-navy">
      <section className="relative isolate bg-[linear-gradient(135deg,#0B1B33_0%,#123D73_58%,#0B1B33_100%)] px-4 pt-8 pb-10 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12 lg:pb-12">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(43,108,176,0.55),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(255,193,7,0.16),transparent_26%)]" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-50 shadow-2xl backdrop-blur">
                <span className="material-symbols-outlined text-base text-brand-gold">verified</span>
                EntranceGateway subscription plans
              </span>
              <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Pick the plan that matches your preparation pace.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
                Subscriptions unlock practice quizzes for 30 days. Your quiz quota follows a rolling
                30-day usage window, while plan access renews when the subscription period ends.
              </p>
            </div>

            <aside className="relative z-10 rounded-[2rem] border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-blue">Current status</p>
                  <h2 className="mt-2 text-2xl font-black">
                    {hasActiveSubscription ? subscription?.planName || subscription?.currentPlan : 'Free access'}
                  </h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${hasActiveSubscription ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  {hasActiveSubscription ? 'Active' : 'No active plan'}
                </span>
              </div>

              {hasActiveSubscription && subscription ? (
                <div className="mt-6 space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">Valid until</p>
                      <p className="mt-1 font-bold">{formatDate(subscription.endDate)}</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">Days left</p>
                      <p className="mt-1 font-bold">{subscription.remainingDays}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Quiz usage</span>
                      <span className="font-semibold text-brand-navy">
                        {subscription.quizzesUsedThisMonth} / {formatQuizLimit(subscription.quizzesLimitPerMonth)}
                      </span>
                    </div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-gold transition-all duration-700"
                        style={{ width: `${subscription.quizzesLimitPerMonth >= 999999 ? 100 : usagePercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-gray-700">
                  You can browse free content now. Subscribe when you are ready to unlock premium
                  practice quizzes and higher limits.
                </p>
              )}

              {loadingSubscription && (
                <p className="mt-4 text-xs text-gray-500">Refreshing subscription details...</p>
              )}
            </aside>
          </div>
        </div>
      </section>

      <section className="relative z-20 border-b border-gray-100 bg-[#F7F9FC] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-3">
          {[
            ['payments', 'Secure checkout', 'Protected payment flow for plans and upgrades.'],
            ['restart_alt', 'Rolling quiz limits', 'Quiz quota refreshes on a rolling 30-day window.'],
            ['lock_open', 'No forced logout', 'Upgrade prompts never break your active session.'],
          ].map(([icon, label, description]) => (
            <div key={label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined rounded-xl bg-brand-navy p-2 text-brand-gold">{icon}</span>
                <div>
                  <p className="font-black text-brand-navy">{label}</p>
                  <p className="mt-1 text-sm leading-5 text-gray-600">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-4 pt-6 pb-10 sm:px-6 lg:px-8 lg:pt-8 lg:pb-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-blue">Pricing</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Choose your access level</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-gray-600">
              Start with Silver, or choose Gold for unlimited monthly practice. You can upgrade when your preparation needs grow.
            </p>
          </div>

          <div className="mb-6 grid gap-4 rounded-[1.75rem] border border-brand-blue/10 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-blue">Choose entrance access</p>
              <p className="mt-1 text-sm font-semibold text-gray-600">
                Select the entrance type this subscription should unlock.
              </p>
            </div>
              {entranceOptions.length > 0 ? (
                <select
                  value={selectedEntranceSlug}
                  onChange={(event) => setSelectedEntranceSlug(event.target.value)}
                  className="h-12 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-bold text-brand-navy shadow-sm outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 md:min-w-64"
                  aria-label="Select entrance type for subscription"
                >
                  {entranceOptions.map((entrance) => (
                    <option key={entrance.slug} value={entrance.slug}>
                      {entrance.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                  Loading available entrance types...
                </p>
              )}
          </div>

          {paymentError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {paymentError}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const meta = planMeta[plan.plan]
              const isCurrent = subscription?.currentPlan === plan.plan && subscription?.isActive

              return (
                <article
                  key={plan.plan}
                  className={`group relative z-10 flex flex-col rounded-3xl border ${meta.border} bg-gradient-to-br ${meta.gradient} p-5 shadow-[0_18px_55px_rgba(15,23,42,0.10)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:p-6`}
                >
                  {meta.badge && (
                    <div className="absolute -top-3 left-6 rounded-full bg-brand-gold px-3.5 py-1 text-xs font-black uppercase tracking-wide text-brand-navy shadow-lg">
                      {meta.badge}
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-blue">{meta.eyebrow}</p>
                      <h2 className="mt-2 text-3xl font-black tracking-tight">{plan.name || plan.plan}</h2>
                    </div>
                    <div className="rounded-2xl bg-brand-navy p-3 text-white shadow-lg transition group-hover:scale-105">
                      <span className="material-symbols-outlined text-3xl">{meta.icon}</span>
                    </div>
                  </div>

                  <p className="mt-4 min-h-[3rem] text-sm leading-6 text-gray-600">{meta.summary}</p>

                  <div className="mt-5 flex items-end gap-2 border-b border-gray-200/70 pb-5">
                    <span className="text-4xl font-black tracking-tight">{formatCurrency(plan.price)}</span>
                    <span className="pb-1.5 text-sm font-semibold text-gray-500">/ {plan.durationDays} days</span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl border border-white/70 bg-white/85 p-3.5 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Practice</p>
                      <p className="mt-1 font-black text-brand-navy">{meta.quizLabel}</p>
                    </div>
                    <div className="rounded-2xl border border-white/70 bg-white/85 p-3.5 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Quiz size</p>
                      <p className="mt-1 font-black text-brand-navy">{meta.questionLabel}</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/70 bg-white/65 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-500">Included benefits</p>
                    <ul className="mt-3 space-y-2.5 text-sm leading-5 text-gray-700">
                      {plan.features?.map((feature) => (
                        <li key={feature} className="flex gap-2.5">
                          <span className="material-symbols-outlined mt-0.5 text-base text-emerald-500">check_circle</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {isCurrent ? (
                    <Link
                      href="/quiz"
                      className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-brand-navy shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 active:scale-[0.99]"
                    >
                      Continue practicing
                    </Link>
                  ) : (
                    <div className="mt-5 space-y-2.5">
                      <button
                        type="button"
                        onClick={() => handleSubscribe(plan)}
                        disabled={processingPlan === plan.plan || !selectedEntranceSlug}
                        className={`inline-flex min-h-12 w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-black shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.99] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 ${meta.button}`}
                      >
                        {processingPlan === plan.plan ? 'Starting payment...' : hasActiveSubscription ? 'Upgrade plan' : 'Subscribe now'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenManualPayment(plan)}
                        className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-brand-blue/15 bg-white/85 px-5 py-2.5 text-sm font-black text-brand-blue shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-lavender focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Manual payment
                      </button>
                    </div>
                  )}
                </article>
              )
            })}
          </div>

          <section className="mt-8 grid gap-4 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-3">
            {[
              ['How renewal works', 'Plans last for 30 days. Renew when access expires to continue premium practice.'],
              ['How quiz reset works', 'Usage limits are calculated on a rolling 30-day window, so practice quota refreshes automatically.'],
              ['Question set purchases', 'One-time question set purchases are separate and stay available for that purchased set.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl bg-gray-50 p-5">
                <h3 className="font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
              </div>
            ))}
          </section>
        </div>
      </section>
      {manualPaymentPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl">
            <div className="bg-gradient-to-br from-brand-navy to-brand-blue p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-gold">Manual subscription payment</p>
                  <h2 className="mt-2 text-2xl font-black">{manualPaymentPlan.name || manualPaymentPlan.plan}</h2>
                  <p className="mt-2 text-sm leading-6 text-blue-100">
                    Record a cash, bank transfer, or office payment with an optional receipt screenshot.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setManualPaymentPlan(null)}
                  disabled={isSubmittingManualPayment}
                  className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20 disabled:opacity-60"
                  aria-label="Close manual payment dialog"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-gray-700">Amount</span>
                  <input
                    type="number"
                    min="1"
                    value={manualPaymentForm.amount}
                    onChange={(event) => setManualPaymentForm(prev => ({ ...prev, amount: Number(event.target.value) }))}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-gray-700">Transaction reference</span>
                  <input
                    value={manualPaymentForm.transactionReference}
                    onChange={(event) => setManualPaymentForm(prev => ({ ...prev, transactionReference: event.target.value }))}
                    placeholder="CASH-2024-001"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-bold text-gray-700">Student email optional</span>
                  <input
                    type="email"
                    value={manualPaymentForm.userEmail}
                    onChange={(event) => setManualPaymentForm(prev => ({ ...prev, userEmail: event.target.value }))}
                    placeholder="student@example.com"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-bold text-gray-700">Remarks</span>
                  <textarea
                    rows={3}
                    value={manualPaymentForm.remarks}
                    onChange={(event) => setManualPaymentForm(prev => ({ ...prev, remarks: event.target.value }))}
                    placeholder="Cash received at office"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-bold text-gray-700">Receipt screenshot optional</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(event) => setManualPaymentFile(event.target.files?.[0] || null)}
                    className="w-full rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-navy file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
                  />
                </label>
              </div>

              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-gray-700">
                This sends <strong>paymentMethod: MANUAL</strong>, <strong>moduleType: SUBSCRIPTION</strong>, and entrance access <strong>{selectedEntranceSlug || 'global'}</strong> to the payment API.
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setManualPaymentPlan(null)}
                disabled={isSubmittingManualPayment}
                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitManualPayment}
                disabled={isSubmittingManualPayment}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 py-3 text-sm font-black text-white transition hover:bg-brand-blue disabled:opacity-60"
              >
                {isSubmittingManualPayment ? 'Submitting...' : 'Submit manual payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
