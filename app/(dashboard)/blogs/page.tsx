import { BlogsPageContent } from '@/components/features/blogs/BlogsPageContent'
import { getBlogs } from '@/services/server/blogs.server'

export const metadata = {
  title: 'Latest News & Articles - EntranceGateway',
  description: 'Empowering students with continuous learning. Stay updated with the latest trends in technology, entrance exam strategies, and educational insights across Nepal.',
}

interface BlogsPageProps {
  searchParams?: Promise<{
    page?: string
    size?: string
  }>
}

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 50

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams
  const page = Math.max(0, Number(params?.page ?? '1') - 1 || 0)
  const size = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(params?.size ?? String(DEFAULT_PAGE_SIZE)) || DEFAULT_PAGE_SIZE)
  )

  const initialData = await getBlogs({ page, size }).catch(() => null)

  return <BlogsPageContent initialData={initialData} initialPage={page} />
}
