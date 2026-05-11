'use client'

import { useState, useEffect } from 'react'
import { fetchUpgradePrice } from '@/services/client/subscription.client'
import type { SubscriptionPlan, UpgradePriceResponse, SubscriptionPlanResponse } from '@/types/subscription.types'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 2,
  }).format(amount)
}

interface UpgradePriceBreakdownProps {
  targetPlan: SubscriptionPlanResponse
  onConfirm: (effectivePrice: number) => void
  onCancel: () => void
  isProcessing: boolean
}

export function UpgradePriceBreakdown({ targetPlan, onConfirm, onCancel, isProcessing }: UpgradePriceBreakdownProps) {
  const [pricing, setPricing] = useState<UpgradePriceResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    let mounted = true

    async function loadPrice() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchUpgradePrice(targetPlan.plan)
        if (mounted) setPricing(data)
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : 'Unable to calculate upgrade price.')
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadPrice()
    return () => { mounted = false }
  }, [targetPlan.plan])

  const remainingDays = pricing?.currentPlanRemainingDays ?? pricing?.remainingDays ?? 0
  const creditAmount = pricing?.currentPlanCredit ?? pricing?.creditAmount ?? 0
  const targetPrice = pricing?.targetPlanPrice ?? targetPlan.price
  const effectivePrice = pricing?.finalUpgradePrice ?? pricing?.effectivePrice ?? targetPrice

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl">
        <div className="bg-gradient-to-br from-brand-navy to-brand-blue p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-gold">Upgrade plan</p>
              <h2 className="mt-2 text-2xl font-black">Upgrade to {targetPlan.name || targetPlan.plan}</h2>
            </div>
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20 disabled:opacity-60"
              aria-label="Close upgrade dialog"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="size-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand-blue" />
              <p className="mt-4 text-sm font-semibold text-gray-500">Calculating upgrade price...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
              <span className="material-symbols-outlined mb-2 text-3xl text-red-400">error</span>
              <p className="text-sm font-bold text-red-700">{error}</p>
              <button
                onClick={onCancel}
                className="mt-4 rounded-xl bg-white px-5 py-2 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                Go back
              </button>
            </div>
          ) : pricing ? (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-600">Current plan</span>
                  <span className="font-black text-brand-navy">{pricing.currentPlan || '—'}</span>
                </div>
                {remainingDays > 0 && (
                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                    <span className="text-sm text-gray-600">Remaining days</span>
                    <span className="font-black text-brand-navy">{remainingDays}</span>
                  </div>
                )}
                <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-600">Target price</span>
                  <span className="font-black text-brand-navy">{formatCurrency(targetPrice)}</span>
                </div>
                {creditAmount > 0 && (
                  <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
                    <span className="text-sm text-emerald-700">Credit ({remainingDays} days)</span>
                    <span className="font-black text-emerald-700">-{formatCurrency(creditAmount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between rounded-2xl border-2 border-brand-blue/20 bg-blue-50 px-4 py-4">
                  <span className="text-sm font-bold text-brand-navy">You pay</span>
                  <span className="text-2xl font-black text-brand-navy">{formatCurrency(Math.max(0, effectivePrice))}</span>
                </div>
              </div>

              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isProcessing}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => onConfirm(Math.max(0, effectivePrice))}
                  disabled={isProcessing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 py-3 text-sm font-black text-white transition hover:bg-brand-blue disabled:opacity-60"
                >
                  {isProcessing ? 'Processing...' : `Pay ${formatCurrency(Math.max(0, effectivePrice))} manually`}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
