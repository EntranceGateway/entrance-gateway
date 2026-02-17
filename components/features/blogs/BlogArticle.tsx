import Link from 'next/link'
import Image from 'next/image'
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer'

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
}

export function BlogArticle({ blog }: BlogArticleProps) {
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
      {blog.image && (
        <div className="mb-8 sm:mb-10 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <Image
            src={blog.image}
            alt={blog.title}
            width={1200}
            height={600}
            className="w-full h-auto object-cover max-h-[300px] sm:max-h-[400px] md:max-h-[500px]"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-none">
        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed font-light mb-6 sm:mb-8 border-l-4 border-brand-gold pl-3 sm:pl-4 italic">
            {blog.excerpt}
          </p>
        )}

        {/* Main Content - Markdown */}
        <MarkdownRenderer content={blog.content} />
      </div>

      {/* Back to Articles Button */}
      <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
        <Link
          href="/blogs"
          className="bg-brand-gold hover:bg-[#FFB300] text-brand-navy font-bold py-2 sm:py-2.5 px-5 sm:px-6 rounded-lg transition-all duration-200 inline-flex items-center gap-2 text-xs sm:text-sm shadow-sm"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-3 sm:size-4">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Back to Articles
        </Link>
      </div>
    </article>
  )
}
