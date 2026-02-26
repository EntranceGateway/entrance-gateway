import Link from 'next/link'
import type { Blog } from '@/types/blogs.types'

interface HomeNewsProps {
  blogsData?: Blog[]
}

export function HomeNews({ blogsData = [] }: HomeNewsProps) {
  // Format blogs for display
  const articles = blogsData.map((blog) => ({
    id: blog.blogId,
    slug: blog.slug,
    blogId: blog.blogId,
    title: blog.title,
    image: `https://api.entrancegateway.com/api/v1/resources/${blog.imageName}`,
    date: new Date(blog.createdDate).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    }),
    category: 'Article',
    excerpt: blog.content.substring(0, 150) + '...',
  }))

  // Show message if no blogs available
  if (articles.length === 0) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-14 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mb-3 sm:mb-4 font-heading">
              Latest news & articles
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Stay updated with the latest educational insights and platform updates.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500 text-base sm:text-lg">No articles available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mb-3 sm:mb-4 font-heading">
            Latest news & articles
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Stay updated with the latest educational insights and platform updates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/blogs/${article.slug || article.blogId}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col sm:flex-row p-4 sm:p-5 md:p-6 items-start sm:items-center gap-4 sm:gap-5 md:gap-6 group"
            >
              {/* Image */}
              <div className="w-full sm:w-1/3 flex-shrink-0">
                <img
                  alt={article.title}
                  className="rounded-lg object-cover h-48 sm:h-28 md:h-32 w-full"
                  src={article.image}
                />
              </div>
              
              {/* Content */}
              <div className="w-full sm:w-2/3">
                <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2 sm:mb-3 leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <div className="flex items-center text-xs sm:text-sm text-gray-500 font-medium flex-wrap gap-2">
                  <span className="flex items-center gap-1">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-3 sm:size-4">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                    </svg>
                    {article.date}
                  </span>
                  <span className="text-gray-300 hidden sm:inline">|</span>
                  <span className="text-gray-600">{article.category}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        {articles.length > 0 && (
          <div className="text-center mt-8 sm:mt-10 md:mt-12">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 bg-brand-gold hover:bg-[#FFB300] text-brand-navy font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 shadow-sm text-sm sm:text-base"
            >
              View All Articles
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
