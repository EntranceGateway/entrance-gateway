import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { QuestionsDetailContent } from '@/components/features/questions/QuestionsDetailContent'
import { CenteredSpinner } from '@/components/shared/Loading'
import { getOldQuestionById } from '@/services/server/questions.server'
import type { Metadata } from 'next'

interface QuestionDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: QuestionDetailPageProps): Promise<Metadata> {
  const { id } = await params
  
  // Validate ID
  if (!id || id === 'undefined') {
    return {
      title: 'Question Not Found | EntranceGateway',
      description: 'The requested question could not be found.',
    }
  }

  try {
    const response = await getOldQuestionById(id)
    const question = response.data

    return {
      title: `${question.setName} - ${question.subject} (${question.year}) | EntranceGateway`,
      description: question.description || `View ${question.setName} for ${question.courseName} - ${question.subject}`,
    }
  } catch {
    return {
      title: 'Question Details - EntranceGateway',
      description: 'View and download old question papers.',
    }
  }
}

export default async function QuestionDetailPage({ params }: QuestionDetailPageProps) {
  const { id } = await params
  
  // Validate ID - show 404 if invalid
  if (!id || id === 'undefined' || id === 'null') {
    notFound()
  }

  // Fetch initial data on server with proper error handling
  let initialData = null
  
  try {
    initialData = await getOldQuestionById(id)
  } catch (error) {
    console.error('Failed to fetch question details:', error)
    // Don't throw - let client component handle the error
  }

  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading question..." />}>
      <QuestionsDetailContent questionId={id} initialData={initialData} />
    </Suspense>
  )
}

