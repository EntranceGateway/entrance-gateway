// Blogs API Types - Matching backend response structure

export interface Blog {
  blogId: number
  title: string
  content: string
  excerpt?: string | null
  imageName: string
  contactEmail: string | null
  contactPhone: string | null
  metaTitle: string | null
  metaDescription: string | null
  keywords: string | null
  createdDate: string // YYYY-MM-DD format
}

export interface BlogsListResponse {
  message: string
  data: {
    content: Blog[]
    totalElements: number
    totalPages: number
    pageNumber: number
    pageSize: number
    last: boolean
  }
}

export interface BlogDetailResponse {
  message: string
  data: Blog
}

export interface BlogsQueryParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

// Error response type
export interface ApiErrorResponse {
  message: string
  data: null
}
