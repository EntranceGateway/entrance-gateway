import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { BlogDetailContent } from '@/components/features/blogs/BlogDetailContent'
import { CenteredSpinner } from '@/components/shared/Loading'
import { getBlogById } from '@/services/server/blogs.server'
import type { Metadata } from 'next'

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  
  if (!slug || slug === 'undefined') {
    return {
      title: 'Blog Not Found | EntranceGateway',
      description: 'The requested blog article could not be found.',
    }
  }

  try {
    const response = await getBlogById(slug)
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
  const { slug } = await params
  
  if (!slug || slug === 'undefined' || slug === 'null') {
    notFound()
  }

  const initialData = await getBlogById(slug).catch(() => null)

  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading article..." />}>
      <BlogDetailContent blogSlug={slug} initialData={initialData} />
    </Suspense>
  )
}
