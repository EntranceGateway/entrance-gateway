import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { TrainingEnrollmentContent } from '@/components/features/trainings/TrainingEnrollmentContent'
import { CenteredSpinner } from '@/components/shared/Loading'
import { getTrainingById } from '@/services/server/trainings.server'
import type { Metadata } from 'next'

interface TrainingEnrollmentPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TrainingEnrollmentPageProps): Promise<Metadata> {
  const { slug } = await params
  
  if (!slug || slug === 'undefined') {
    return {
      title: 'Training Enrollment | EntranceGateway',
      description: 'Enroll in a training program.',
    }
  }

  try {
    const response = await getTrainingById(slug)
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
  const { slug } = await params
  
  if (!slug || slug === 'undefined' || slug === 'null') {
    notFound()
  }

  // Fetch training data on server
  const initialData = await getTrainingById(slug).catch(() => null)

  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading enrollment form..." />}>
      <TrainingEnrollmentContent trainingId={slug} initialData={initialData} />
    </Suspense>
  )
}
