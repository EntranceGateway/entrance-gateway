import { TrainingsPageContent } from '@/components/features/trainings'
import { getTrainings } from '@/services/server/trainings.server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Upcoming Trainings | EntranceGateway',
  description: 'Advance your career with our expert-led technical trainings and exam preparation courses. Secure your spot in the next cohort.',
}

export default async function TrainingsPage() {
  // Fetch initial data from server for SSR
  const initialData = await getTrainings({ 
    page: 0, 
    size: 12,
    sortBy: 'trainingStatus',
    sortDir: 'asc',
  }).catch(() => null)
  
  return <TrainingsPageContent initialData={initialData} />
}
