import { BlogsPageContent } from '@/components/features/blogs/BlogsPageContent'
import { getBlogs } from '@/services/server/blogs.server'

export const metadata = {
  title: 'Latest News & Articles - EntranceGateway',
  description: 'Empowering students with continuous learning. Stay updated with the latest trends in technology, entrance exam strategies, and educational insights across Nepal.',
}

export default async function BlogsPage() {
  // Fetch initial data on server
  const initialData = await getBlogs({ page: 0, size: 10 }).catch(() => null)

  return <BlogsPageContent initialData={initialData} />
}
