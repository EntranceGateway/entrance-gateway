// Client-side Blogs API calls (for CSR)

import type {
  BlogsListResponse,
  BlogDetailResponse,
  BlogsQueryParams,
} from '@/types/blogs.types'

/**
 * Fetch paginated list of blogs (Client-side via proxy)
 * Used in Client Components
 */
export async function fetchBlogs(params: BlogsQueryParams = {}): Promise<BlogsListResponse> {
  const {
    page = 0,
    size = 10,
    sortBy = 'createdDate',
    sortDir = 'desc',
  } = params

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir,
  })

  const response = await fetch(`/api/blogs?${queryParams}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch blogs: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetch single blog by ID (Client-side via proxy)
 * Used in Client Components
 */
export async function fetchBlogById(id: string): Promise<BlogDetailResponse> {
  const response = await fetch(`/api/blogs/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch blog: ${response.statusText}`)
  }

  return response.json()
}
