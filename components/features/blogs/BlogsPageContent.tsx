'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { BlogsHeader } from './BlogsHeader'
import { BlogsCard } from './BlogsCard'
import { BlogsPagination } from './BlogsPagination'
import { CenteredSpinner } from '@/components/shared/Loading'
import { fetchBlogs } from '@/services/client/blogs.client'
import type { Blog, BlogsListResponse } from '@/types/blogs.types'

interface BlogsPageContentProps {
  initialData?: BlogsListResponse | null
  initialPage?: number
}

const stripMarkdown = (markdown: string): string => {
  let text = markdown
  text = text.replace(/```[\s\S]*?```/g, '')
  text = text.replace(/`([^`]+)`/g, '$1')
  text = text.replace(/^#{1,6}\s+/gm, '')
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2')
  text = text.replace(/(\*|_)(.*?)\1/g, '$2')
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
  text = text.replace(/^>\s+/gm, '')
  text = text.replace(/^(---|\*\*\*)$/gm, '')
  text = text.replace(/^[\*\-\+]\s+/gm, '')
  text = text.replace(/^\d+\.\s+/gm, '')
  text = text.replace(/\n\n+/g, ' ')
  text = text.replace(/\n/g, ' ')
  text = text.trim()
  return text
}

export function BlogsPageContent({ initialData, initialPage = 0 }: BlogsPageContentProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [blogs, setBlogs] = useState<Blog[]>(initialData?.data.content || [])
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(initialData?.data.totalPages || 1)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialData) {
      return
    }

    setCurrentPage(initialPage)
    setBlogs(initialData.data.content || [])
    setTotalPages(initialData.data.totalPages || 1)
    setIsLoading(false)
    setError(null)
  }, [initialData, initialPage])

  const updatePageUrl = (pageIndex: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(pageIndex + 1))
    params.set('size', '10')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    if (initialData && currentPage === initialPage) {
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
  }, [currentPage, initialData, initialPage])

  const handleReadArticle = (_id: string) => {
    // Navigation handled by Link in BlogsCard
  }

  const handlePageChange = (page: number) => {
    const nextPage = page - 1
    setCurrentPage(nextPage)
    updatePageUrl(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="flex-grow">
      <BlogsHeader />

      <div data-role="page-content" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div data-role="blog-list" className="flex flex-col gap-8">
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
            blogs.map((blog) => (
              <BlogsCard
                key={blog.blogId}
                article={{
                  id: blog.blogId.toString(),
                  slug: blog.slug,
                  blogId: blog.blogId,
                  title: blog.title,
                  description: blog.excerpt || stripMarkdown(blog.content).substring(0, 150) + '...',
                  image: blog.imageName 
                    ? (blog.imageName.startsWith('http') 
                        ? blog.imageName 
                        : `https://api.entrancegateway.com/api/v1/resources/${blog.imageName}`)
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
            ))
          )}
        </div>

        {!isLoading && !error && totalPages > 1 && blogs.length > 0 && (
          <BlogsPagination
            currentPage={currentPage + 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}


      </div>
    </main>
  )
}
