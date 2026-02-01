import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { TrainingEnrollmentContent } from '@/components/features/trainings/TrainingEnrollmentContent'
import { CenteredSpinner } from '@/components/shared/Loading'
import { getTrainingById } from '@/services/server/trainings.server'
import type { Metadata } from 'next'

interface TrainingEnrollmentPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: TrainingEnrollmentPageProps): Promise<Metadata> {
  const { id } = await params
  
  if (!id || id === 'undefined') {
    return {
      title: 'Training Enrollment | EntranceGateway',
      description: 'Enroll in a training program.',
    }
  }

  try {
    const response = await getTrainingById(id)
    const training = response.data

    return {
      title: `Enroll in ${training.trainingName} | EntranceGateway`,
      description: `Complete your enrollment for ${training.trainingName} training program`,
    }
  } catch {
    return {
      title: 'Training Enrollment | EntranceGateway',
      description: 'Complete your training enrollment.',
    }
  }
}

export default async function TrainingEnrollmentPage({ params }: TrainingEnrollmentPageProps) {
  const { id } = await params
  
  if (!id || id === 'undefined' || id === 'null') {
    notFound()
  }

  // Fetch training data on server
  const initialData = await getTrainingById(id).catch(() => null)

  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading enrollment form..." />}>
      <TrainingEnrollmentContent trainingId={id} initialData={initialData} />
    </Suspense>
  )
}
