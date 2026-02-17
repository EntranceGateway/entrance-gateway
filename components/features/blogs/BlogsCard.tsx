import Link from 'next/link'
import Image from 'next/image'

interface Article {
  id: string
  title: string
  description: string
  image: string
  category: string
  date: string
}

interface BlogsCardProps {
  article: Article
  onReadArticle: (id: string) => void
}

export function BlogsCard({ article, onReadArticle }: BlogsCardProps) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-gray-200 flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow group">
      {/* Image Section */}
      <div className="md:w-1/3 h-48 sm:h-56 md:h-auto relative overflow-hidden">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-12 sm:size-16 text-gray-300">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="md:w-2/3 p-5 sm:p-6 md:p-8 flex flex-col justify-between">
        <div>
          {/* Category and Date */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
            <span className="bg-brand-blue text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
              {article.category}
            </span>
            <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
              </svg>
              {article.date}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-brand-navy mb-2 sm:mb-3 group-hover:text-brand-blue transition-colors leading-tight">
            {article.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {article.description}
          </p>
        </div>

        {/* Read Button */}
        <div className="mt-5 sm:mt-6 md:mt-8 flex justify-end">
          <Link
            href={`/blogs/${article.id}`}
            className="bg-brand-gold hover:bg-[#FFB300] text-brand-navy font-bold py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg transition-all duration-200 flex items-center gap-2 text-xs sm:text-sm shadow-sm w-full sm:w-auto justify-center"
          >
            Read Full Article
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}
