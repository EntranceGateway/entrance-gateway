'use client'

import type { ChatSource } from './types'

interface ChatbotSourceListProps {
  sources: ChatSource[]
  onSourceClick?: (source: ChatSource) => void
}

export function ChatbotSourceList({ sources, onSourceClick }: ChatbotSourceListProps) {
  if (!sources || sources.length === 0) {
    return null
  }

  const getSourceTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'course':
        return 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
      case 'training':
        return 'bg-brand-navy/10 text-brand-navy border-brand-navy/20'
      case 'syllabus':
        return 'bg-brand-gold/10 text-brand-navy border-brand-gold/30'
      case 'blog':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'college':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getSourceTypeLabel = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
        Sources ({sources.length})
      </h4>
      <div className="space-y-2">
        {sources.map((source) => (
          <button
            key={`${source.number}-${source.chunk_id}`}
            onClick={() => onSourceClick?.(source)}
            className={`
              w-full text-left px-3 py-2 rounded-lg border
              transition-all duration-200
              hover:shadow-sm hover:scale-[1.02]
              focus:outline-none focus:ring-2 focus:ring-brand-blue/30
              ${getSourceTypeColor(source.source_type)}
            `}
          >
            <div className="flex items-start gap-2">
              {/* Citation Number */}
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white border border-current flex items-center justify-center text-xs font-bold">
                {source.number}
              </span>

              {/* Source Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{source.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-white/50">
                    {getSourceTypeLabel(source.source_type)}
                  </span>
                  {source.source_id && (
                    <span className="text-xs text-gray-500 truncate">
                      ID: {source.source_id}
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="flex-shrink-0 w-4 h-4 opacity-50"
              >
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
