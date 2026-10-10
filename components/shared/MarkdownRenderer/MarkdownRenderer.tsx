'use client'

import ReactMarkdown, { defaultUrlTransform } from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function markdownUrl(url: string, key: string): string {
  const safe = defaultUrlTransform(url)
  if (!safe) return ''
  if (key === 'src' && !/^https?:\/\//i.test(safe) && !safe.startsWith('/')) {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    return `${base}/api/v1/resources/${safe}`
  }
  return safe
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown skipHtml remarkPlugins={[remarkGfm]} urlTransform={markdownUrl}
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-bold mt-10 mb-5">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>,
          p: ({ children }) => <p className="leading-relaxed mb-5">{children}</p>,
          a: ({ children, href }) => <a href={href} className="text-brand-blue underline" target="_blank" rel="noopener noreferrer">{children}</a>,
          ul: ({ children }) => <ul className="list-disc ml-6 mb-5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-6 mb-5">{children}</ol>,
          pre: ({ children }) => <pre className="bg-gray-100 rounded-lg p-4 my-5 overflow-x-auto">{children}</pre>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-brand-gold pl-4 my-5">{children}</blockquote>,
          table: ({ children }) => <div className="overflow-x-auto my-5"><table className="min-w-full border border-gray-300">{children}</table></div>,
          th: ({ children }) => <th className="border px-4 py-2 text-left">{children}</th>,
          td: ({ children }) => <td className="border px-4 py-2">{children}</td>,
        }}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
