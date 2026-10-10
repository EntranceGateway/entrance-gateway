'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FormSelect } from '@/components/shared/Form/FormSelect'
import { Pagination } from '@/components/features/profile/Pagination'

type Option = { entranceTypeId: number; entranceName: string; categoryId: number; categoryName: string }
type Leaderboard = {
  currentUser: { rank: number | null; scoredPercentage: number | null; totalParticipants: number; coverageNotice: string }
  rankings: { rank: number; fullName: string; scoredPercentage: number; currentUser: boolean }[]
  page: number
  size: number
}

async function load<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal, cache: 'no-store' })
  const body = await response.json()
  if (!response.ok) throw new Error(response.status === 401 ? 'Please sign in to view the leaderboard.' : body.message || 'Unable to load the leaderboard.')
  if (body.data == null) throw new Error('Unable to load the leaderboard.')
  return body.data
}

export function LeaderboardPageContent() {
  const [options, setOptions] = useState<Option[]>([])
  const [entrance, setEntrance] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(0)
  const [data, setData] = useState<Leaderboard | null>(null)
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [optionsError, setOptionsError] = useState('')
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [optionsRetry, setOptionsRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    load<Option[]>('/api/quiz-attempts/leaderboard/options', controller.signal).then(result => {
      if (controller.signal.aborted) return
      if (!Array.isArray(result)) throw new Error('Unable to load entrance types and categories.')
      setOptions(result)
      setEntrance(String(result[0]?.entranceTypeId ?? ''))
      setCategory(String(result[0]?.categoryId ?? ''))
      setPage(0)
    }).catch(cause => {
      if (!controller.signal.aborted) setOptionsError(cause instanceof Error ? cause.message : 'Unable to load entrance types and categories.')
    }).finally(() => {
      if (!controller.signal.aborted) setOptionsLoading(false)
    })
    return () => controller.abort()
  }, [optionsRetry])

  useEffect(() => {
    const controller = new AbortController()
    if (!entrance || !category) return () => controller.abort()
    load<Leaderboard>(`/api/quiz-attempts/leaderboard/category/${category}?entranceTypeId=${entrance}&page=${page}&size=20`, controller.signal).then(result => {
      if (controller.signal.aborted) return
      if (!result.currentUser || !Array.isArray(result.rankings)) throw new Error('Unable to load the leaderboard.')
      setData(result)
    }).catch(cause => {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'Unable to load the leaderboard.')
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => controller.abort()
  }, [entrance, category, page, retry])

  const entrances = [...new Map(options.map(option => [String(option.entranceTypeId), { value: String(option.entranceTypeId), label: option.entranceName }])).values()]
  const categories = options.filter(option => String(option.entranceTypeId) === entrance)
  const currentUser = data?.currentUser

  function startLoading() {
    setData(null)
    setError('')
    setLoading(true)
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">Leaderboard</h1>
        <p className="mt-2 text-gray-600">Compare each student&apos;s best submitted category score within the selected entrance type.</p>
        <p className="mt-1 text-sm text-gray-500">Negative marking is included. Equal scores share a rank, for example 1, 1, 3. Scores are displayed to two decimal places; ranks use the full score.</p>
      </div>
      {optionsError ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p>{optionsError}</p>
          <button className="mt-2 underline" onClick={() => {
            setOptionsLoading(true)
            setOptionsError('')
            setOptionsRetry(value => value + 1)
          }}>Retry entrance types</button>
        </div>
      ) : optionsLoading ? <p role="status">Loading entrance types...</p> : !options.length ? (
        <p role="status">No entrance categories are available yet.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <FormSelect id="leaderboard-entrance" label="Entrance type" value={entrance} options={entrances} onChange={event => {
              const next = event.target.value
              if (next === entrance) return
              startLoading()
              setEntrance(next)
              setCategory(String(options.find(option => String(option.entranceTypeId) === next)?.categoryId ?? ''))
              setPage(0)
            }} />
            <FormSelect id="leaderboard-category" label="Category" value={category} options={categories.map(option => ({ value: String(option.categoryId), label: option.categoryName }))} onChange={event => {
              if (event.target.value === category) return
              startLoading()
              setCategory(event.target.value)
              setPage(0)
            }} />
          </div>
          <section aria-label="Category leaderboard" aria-busy={loading} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            {loading ? <p role="status" className="p-6">Loading leaderboard...</p> : error ? (
              <div role="alert" className="p-6 text-red-700">
                <p>{error}</p>
                <button className="mt-2 underline" onClick={() => {
                  startLoading()
                  setRetry(value => value + 1)
                }}>Retry leaderboard</button>
              </div>
            ) : data && currentUser ? (
              <>
                <div className="p-6 space-y-2 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-brand-navy">Your standing</h2>
                  {currentUser.rank === null ? <p>You have no eligible submitted attempt in this category and entrance.</p> : (
                    <p>Your rank: <strong>{currentUser.rank}</strong> &middot; Best category score: <strong>{currentUser.scoredPercentage?.toFixed(2)}%</strong></p>
                  )}
                  <p>Eligible students: {currentUser.totalParticipants}</p>
                  <p className="text-sm text-gray-500">{currentUser.coverageNotice}</p>
                </div>
                {!currentUser.totalParticipants ? <p role="status" className="p-6">No eligible submitted attempts yet.</p> : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <caption className="sr-only">Category leaderboard for {entrances.find(option => option.value === entrance)?.label}, {categories.find(option => String(option.categoryId) === category)?.categoryName}</caption>
                        <thead className="bg-gray-50 text-gray-600"><tr>
                          <th scope="col" className="px-4 py-3">Rank</th><th scope="col" className="px-4 py-3">Student</th><th scope="col" className="px-4 py-3 text-right">Category score</th>
                        </tr></thead>
                        <tbody>{data.rankings.map((entry, index) => (
                          <tr key={index} className={entry.currentUser ? 'border-t border-gray-100 bg-yellow-50' : 'border-t border-gray-100'}>
                            <td className="px-4 py-3 font-semibold">{entry.rank}</td>
                            <td className="px-4 py-3 break-words">{entry.fullName}{entry.currentUser && <span className="ml-2 font-semibold">(You)</span>}</td>
                            <td className="px-4 py-3 text-right tabular-nums">{entry.scoredPercentage.toFixed(2)}%</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                    <Pagination currentPage={data.page} totalPages={Math.ceil(currentUser.totalParticipants / data.size)} onPageChange={next => {
                      if (next === page) return
                      startLoading()
                      setPage(next)
                    }} />
                  </>
                )}
              </>
            ) : null}
          </section>
          <Link href="/quiz" className="inline-block text-brand-blue underline">Take a quiz</Link>
        </>
      )}
    </main>
  )
}
