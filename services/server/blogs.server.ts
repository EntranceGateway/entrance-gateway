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
 * Fetch single blog by ID (Server-side)
 * Used in Server Components for SSR
 */
export async function getBlogById(id: string): Promise<BlogDetailResponse> {
  return apiClient<BlogDetailResponse>(`/api/v1/blogs/${id}`, {
    cache: 'no-store',
  })
}
