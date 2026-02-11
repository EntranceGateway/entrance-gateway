import Link from 'next/link'
import type { Note } from '@/types/notes.types'

interface NotesCardProps {
  item: Note
}

export function NotesCard({ item }: NotesCardProps) {
  return (
    <div className="group bg-white border border-gray-200 hover:border-brand-blue/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* Header: Code and Course Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-600 font-mono tracking-tight">
            {item.subjectCode}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-brand-blue/10 text-brand-blue">
            {item.courseName}
          </span>
        </div>
      </div>

      {/* Note Title */}
      <h3 className="text-xl font-bold text-brand-navy mb-2 line-clamp-1 group-hover:text-brand-blue transition-colors">
        {item.subject}
      </h3>


      {/* Semester Tag */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200 text-gray-500 uppercase tracking-wide">
          Semester {item.semester}
        </span>
        {item.year && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200 text-gray-500 uppercase tracking-wide">
            Year {item.year}
          </span>
        )}
      </div>

      {/* University */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 shrink-0">
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
        </svg>
        <span>{item.affiliation}</span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed flex-grow">
        {item.noteDescription}
      </p>

      {/* Actions */}
      <div className="flex items-center pt-4 border-t border-gray-100 mt-auto">
        <Link
          href={`/notes/${item.noteId}`}
          className="w-full bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-2 px-4 rounded-lg transition-colors text-sm shadow-sm text-center"
        >
          View Note
        </Link>
      </div>
    </div>
  )
}

// Card Grid Container
export function NotesCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {children}
    </div>
  )
}
