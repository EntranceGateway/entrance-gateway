import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { BlogDetailContent } from '@/components/features/blogs/BlogDetailContent'
import { CenteredSpinner } from '@/components/shared/Loading'
import { getBlogById } from '@/services/server/blogs.server'
import type { Metadata } from 'next'

interface BlogDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params
  
  // Validate ID
  if (!id || id === 'undefined') {
    return {
      title: 'Blog Not Found | EntranceGateway',
      description: 'The requested blog article could not be found.',
    }
  }

  try {
    const response = await getBlogById(id)
    const blog = response.data

    return {
      title: `${blog.title} - EntranceGateway`,
      description: blog.metaDescription || blog.content.substring(0, 160),
    }
  } catch {
    return {
      title: 'Blog Article - EntranceGateway',
      description: 'Read our latest articles and insights.',
    }
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params
  
  // Validate ID
  if (!id || id === 'undefined' || id === 'null') {
    notFound()
  }

  // Fetch initial data on server
  const initialData = await getBlogById(id).catch(() => null)

  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading article..." />}>
      <BlogDetailContent blogId={id} initialData={initialData} />
    </Suspense>
  )
}
