import { TrainingsPageContent } from '@/components/features/trainings'
import { getTrainings } from '@/services/server/trainings.server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Upcoming Trainings | EntranceGateway',
  description: 'Advance your career with our expert-led technical trainings and exam preparation courses. Secure your spot in the next cohort.',
}

interface TrainingsPageProps {
  searchParams?: Promise<{
    page?: string
    size?: string
  }>
}

const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 50

export default async function TrainingsPage({ searchParams }: TrainingsPageProps) {
  const params = await searchParams
  const page = Math.max(0, Number(params?.page ?? '1') - 1 || 0)
  const size = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(params?.size ?? String(DEFAULT_PAGE_SIZE)) || DEFAULT_PAGE_SIZE)
  )

  const initialData = await getTrainings({ 
    page,
    size,
    sortBy: 'trainingStatus',
    sortDir: 'asc',
  }).catch(() => null)
  
  return <TrainingsPageContent initialData={initialData} initialPage={page} />
}
