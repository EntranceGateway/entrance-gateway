'use client'

import { useState, useEffect } from 'react'
import { BlogBreadcrumb } from './BlogBreadcrumb'
import { BlogArticle } from './BlogArticle'
import { CenteredSpinner } from '@/components/shared/Loading'
import { fetchBlogById } from '@/services/client/blogs.client'
import type { Blog, BlogDetailResponse } from '@/types/blogs.types'

interface BlogDetailContentProps {
  blogId: string
  initialData?: BlogDetailResponse | null
}

export function BlogDetailContent({ blogId, initialData }: BlogDetailContentProps) {
  const [blog, setBlog] = useState<Blog | null>(initialData?.data || null)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  // Fetch blog data (skip if we have SSR data)
  useEffect(() => {
    if (initialData) {
      return
    }

    const loadBlog = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchBlogById(blogId)
        setBlog(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog')
      } finally {
        setIsLoading(false)
      }
    }

    loadBlog()
  }, [blogId, initialData])

  // Loading State
  if (isLoading) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <CenteredSpinner size="lg" text="Loading article..." />
        </div>
      </main>
    )
  }

  // Error State
  if (error || !blog) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-error/10 border border-error text-error p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <div>
                <h3 className="font-bold text-lg mb-1">Failed to load article</h3>
                <p className="text-sm">{error || 'Article not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Format blog data for components
  const formattedBlog = {
    id: blog.blogId.toString(),
    title: blog.title,
    category: 'Article',
    date: new Date(blog.createdDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    readTime: `${Math.ceil(blog.content.split(' ').length / 200)} min read`,
    image: blog.imageName 
      ? `https://api.entrancegateway.com/api/v1/resources/${blog.imageName}`
      : '/placeholder-blog.jpg',
    excerpt: blog.content.substring(0, 200) + '...',
    content: blog.content,
  }

  return (
    <main className="flex-grow">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Article - Full Width */}
        <BlogArticle blog={formattedBlog} />
      </div>
    </main>
  )
}
