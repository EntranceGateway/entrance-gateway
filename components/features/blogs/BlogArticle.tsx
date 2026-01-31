import Link from 'next/link'

interface Blog {
  id: string
  title: string
  category: string
  date: string
  readTime: string
  image: string
  excerpt: string
  content: string
}

interface BlogArticleProps {
  blog: Blog
  onShare: (platform: string) => void
}

export function BlogArticle({ blog, onShare }: BlogArticleProps) {
  return (
    <article className="w-full">
      {/* Header */}
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 flex-wrap">
          <span className="bg-brand-blue text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
            {blog.category}
          </span>
          <span className="text-gray-500 text-xs sm:text-sm font-medium flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-3 sm:size-4">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
            </svg>
            {blog.date}
          </span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span className="text-gray-500 text-xs sm:text-sm font-medium flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-3 sm:size-4">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
            {blog.readTime}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-navy mb-4 sm:mb-6 font-heading tracking-tight leading-tight">
          {blog.title}
        </h1>
      </header>

      {/* Featured Image */}
      <div className="mb-8 sm:mb-10 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-auto object-cover max-h-[300px] sm:max-h-[400px] md:max-h-[500px]"
        />
      </div>

      {/* Content */}
      <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
        {/* Excerpt */}
        <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed font-light mb-6 sm:mb-8 border-l-4 border-brand-gold pl-3 sm:pl-4 italic">
          {blog.excerpt}
        </p>

        {/* Main Content */}
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>

      {/* Share Section */}
      <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full md:w-auto">
            <span className="text-gray-900 font-bold text-xs sm:text-sm uppercase tracking-wide">
              Share this article:
            </span>
            <div className="flex gap-2">
              {/* Facebook */}
              <button
                onClick={() => onShare('facebook')}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-brand-blue hover:text-white text-gray-600 transition-colors duration-200"
                aria-label="Share on Facebook"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              {/* Twitter */}
              <button
                onClick={() => onShare('twitter')}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-brand-blue hover:text-white text-gray-600 transition-colors duration-200"
                aria-label="Share on Twitter"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>

              {/* Copy Link */}
              <button
                onClick={() => onShare('copy')}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-brand-blue hover:text-white text-gray-600 transition-colors duration-200"
                aria-label="Copy Link"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5">
                  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                </svg>
              </button>
            </div>
          </div>

          <Link
            href="/blogs"
            className="bg-brand-gold hover:bg-[#FFB300] text-brand-navy font-bold py-2 sm:py-2.5 px-5 sm:px-6 rounded-lg transition-all duration-200 flex items-center gap-2 text-xs sm:text-sm shadow-sm w-full sm:w-auto justify-center"
          >
            Back to Articles
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-3 sm:size-4">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}
