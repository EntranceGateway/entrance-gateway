import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { TrainingsDetailContent } from '@/components/features/trainings/TrainingsDetailContent'
import { CenteredSpinner } from '@/components/shared/Loading'
import { getTrainingById } from '@/services/server/trainings.server'
import type { Metadata } from 'next'

interface TrainingsDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: TrainingsDetailPageProps): Promise<Metadata> {
  const { id } = await params
  
  // Validate ID
  if (!id || id === 'undefined') {
    return {
      title: 'Training Not Found | EntranceGateway',
      description: 'The requested training could not be found.',
    }
  }

  try {
    const response = await getTrainingById(id)
    const training = response.data

    return {
      title: `${training.trainingName} - ${training.trainingCategory} | EntranceGateway`,
      description: training.description || `Join our ${training.trainingName} training program`,
    }
  } catch {
    return {
      title: 'Training Details | EntranceGateway',
      description: 'View training details and register for upcoming programs.',
    }
  }
}

export default async function TrainingsDetailPage({ params }: TrainingsDetailPageProps) {
  const { id } = await params
  
  // Validate ID - show 404 if invalid
  if (!id || id === 'undefined' || id === 'null') {
    notFound()
  }

  // Fetch initial data on server
  const initialData = await getTrainingById(id).catch(() => null)

  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading training..." />}>
      <TrainingsDetailContent trainingId={id} initialData={initialData} />
    </Suspense>
  )
}
