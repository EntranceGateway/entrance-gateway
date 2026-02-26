// Server-side Blogs API calls (for SSR)

import { apiClient } from '../api/client'
import type {
  BlogsListResponse,
  BlogDetailResponse,
  BlogsQueryParams,
} from '@/types/blogs.types'

/**
 * Fetch paginated list of blogs (Server-side)
 * Used in Server Components for SSR
 */
export async function getBlogs(
  params: BlogsQueryParams = {}
): Promise<BlogsListResponse> {
  const {
    page = 0,
    size = 10,
    sortBy = 'createdDate',
    sortDir = 'desc',
  } = params

  return apiClient<BlogsListResponse>('/api/v1/blogs', {
    params: {
      page,
      size,
      sortBy,
      sortDir,
    },
    cache: 'no-store',
  })
}

/**
 * Fetch single blog by ID or slug (Server-side)
 * Used in Server Components for SSR
 */
export async function getBlogById(identifier: string): Promise<BlogDetailResponse> {
  const isSlug = /[a-z-]/.test(identifier)
  const endpoint = isSlug ? `/api/v1/blogs/slug/${identifier}` : `/api/v1/blogs/${identifier}`
  
  return apiClient<BlogDetailResponse>(endpoint, {
    cache: 'no-store',
  })
}
