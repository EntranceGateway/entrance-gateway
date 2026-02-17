'use client'

import { useState, useEffect } from 'react'
import { BlogsHeader } from './BlogsHeader'
import { BlogsCard } from './BlogsCard'
import { BlogsPagination } from './BlogsPagination'
import { CenteredSpinner } from '@/components/shared/Loading'
import { fetchBlogs } from '@/services/client/blogs.client'
import type { Blog, BlogsListResponse } from '@/types/blogs.types'

interface BlogsPageContentProps {
  initialData?: BlogsListResponse | null
}

export function BlogsPageContent({ initialData }: BlogsPageContentProps) {
  const [blogs, setBlogs] = useState<Blog[]>(initialData?.data.content || [])
  const [currentPage, setCurrentPage] = useState(initialData?.data.pageNumber || 0)
  const [totalPages, setTotalPages] = useState(initialData?.data.totalPages || 1)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  // Fetch blogs when page changes
  useEffect(() => {
    // Skip if we have initial data and on first page
    if (initialData && currentPage === 0) {
      return
    }

    const loadBlogs = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchBlogs({ page: currentPage, size: 10 })
        setBlogs(response.data.content)
        setTotalPages(response.data.totalPages)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blogs')
      } finally {
        setIsLoading(false)
      }
    }

    loadBlogs()
  }, [currentPage, initialData])

  const handleReadArticle = (id: string) => {
    // Navigation handled by Link in BlogsCard
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1) // API uses 0-based indexing
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <BlogsHeader />

      {/* Articles List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <CenteredSpinner size="lg" text="Loading articles..." />
        ) : error ? (
          <div className="bg-error/10 border border-error text-error p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <div>
                <h3 className="font-bold text-lg mb-1">Failed to load articles</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-8">
              {blogs.map((blog) => (
                <BlogsCard
                  key={blog.blogId}
                  article={{
                    id: blog.blogId.toString(),
                    title: blog.title,
                    description: blog.content.substring(0, 200) + '...',
                    image: blog.imageName 
                      ? `https://api.entrancegateway.com/api/v1/resources/${blog.imageName}`
                      : '',
                    category: 'Article',
                    date: new Date(blog.createdDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }),
                  }}
                  onReadArticle={handleReadArticle}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <BlogsPagination
                currentPage={currentPage + 1} // Display 1-based indexing
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </main>
  )
}
