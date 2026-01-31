import Link from 'next/link'

interface RelatedArticle {
  id: string
  title: string
  date: string
  image?: string | null
  icon?: string
}

interface BlogSidebarProps {
  relatedArticles: RelatedArticle[]
  email: string
  onEmailChange: (email: string) => void
  onSubscribe: (e: React.FormEvent) => void
}

export function BlogSidebar({
  relatedArticles,
  email,
  onEmailChange,
  onSubscribe,
}: BlogSidebarProps) {
  return (
    <aside className="lg:col-span-4 space-y-8 mt-12 lg:mt-0">
      <div className="sticky top-24">
        {/* Related Articles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-brand-navy mb-6 pb-2 border-b border-gray-100">
            Related Articles
          </h3>
          <div className="flex flex-col gap-6">
            {relatedArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blogs/${article.id}`}
                className="group flex gap-4 items-start"
              >
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-8">
                        {article.icon === 'code' && (
                          <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                        )}
                        {article.icon === 'calculate' && (
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5.97 4.06L14.09 6l1.41 1.41L16.91 6l1.06 1.06-1.41 1.41 1.41 1.41-1.06 1.06-1.41-1.4-1.41 1.41-1.06-1.06 1.41-1.41-1.41-1.42zm-6.78.66h5v1.5h-5v-1.5zM11.5 16h-2v2H8v-2H6v-1.5h2v-2h1.5v2h2V16zm6.5 1.25h-5v-1.5h5v1.5zm0-2.5h-5v-1.5h5v1.5z" />
                        )}
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-brand-navy group-hover:text-brand-blue transition-colors line-clamp-2 mb-1">
                    {article.title}
                  </h4>
                  <span className="text-xs text-gray-500">{article.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-brand-navy rounded-xl shadow-md p-6 text-white mt-8">
          <h3 className="text-lg font-bold mb-2">Join our Newsletter</h3>
          <p className="text-sm text-gray-300 mb-4">
            Get the latest tech articles and entrance tips delivered to your inbox.
          </p>
          <form onSubmit={onSubscribe} className="flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Your email address"
              className="w-full rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm px-3 py-2 focus:ring-brand-gold focus:border-brand-gold focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-brand-gold text-brand-navy font-bold py-2 rounded text-sm hover:bg-[#FFB300] transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
