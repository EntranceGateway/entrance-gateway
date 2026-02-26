import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { QuestionsDetailContent } from '@/components/features/questions/QuestionsDetailContent'
import { CenteredSpinner } from '@/components/shared/Loading'
import { getOldQuestionById } from '@/services/server/questions.server'
import type { Metadata } from 'next'

interface QuestionDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: QuestionDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  
  if (!slug || slug === 'undefined') {
    return {
      title: 'Question Not Found | EntranceGateway',
      description: 'The requested question could not be found.',
    }
  }

  try {
    const response = await getOldQuestionById(slug)
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
  const { slug } = await params
  
  if (!slug || slug === 'undefined' || slug === 'null') {
    notFound()
  }

  let initialData = null
  
  try {
    initialData = await getOldQuestionById(slug)
  } catch (error) {
    console.error('Failed to fetch question details:', error)
  }

  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading question..." />}>
      <QuestionsDetailContent questionSlug={slug} initialData={initialData} />
    </Suspense>
  )
}

