'use client'

import { useState, useEffect } from 'react'
import { NotesDetailSidebar } from './NotesDetailSidebar'
import { CenteredSpinner } from '@/components/shared/Loading'
import { SimplePDFViewer } from '@/components/shared/SimplePDFViewer'
import { useResourceFile } from '@/hooks/api/useResourceFile'
import { fetchNoteById } from '@/services/client/notes.client'
import type { Note, NoteDetailResponse } from '@/types/notes.types'

interface NotesDetailContentProps {
  noteId: string
  initialData?: NoteDetailResponse | null
}

export function NotesDetailContent({ noteId, initialData }: NotesDetailContentProps) {
  const [note, setNote] = useState<Note | null>(initialData?.data || null)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  // Fetch note data (skip if we have SSR data)
  useEffect(() => {
    // Skip if we already have initial data
    if (initialData) {
      return
    }

    const loadNote = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchNoteById(noteId)
        setNote(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load note')
        console.error('Error fetching note:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadNote()
  }, [noteId, initialData])

  // Fetch PDF file using resource hook (noteName contains the file name)
  const {
    url: pdfUrl,
    isLoading: isPdfLoading,
    error: pdfError,
  } = useResourceFile(note?.noteName || null, {
    enabled: !!note?.noteName,
  })

  // Loading State
  if (isLoading) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <CenteredSpinner size="lg" text="Loading note..." />
        </div>
      </main>
    )
  }

  // Error State
  if (error || !note) {
    return (
      <main className="flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-error/10 border border-error text-error p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <div>
                <h3 className="font-bold text-lg mb-1">Failed to load note</h3>
                <p className="text-sm">{error || 'Note not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-grow">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Main Content Grid - PDF First on Mobile */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* PDF Viewer - Full width on mobile, 8 cols on desktop */}
          <div className="w-full lg:col-span-8 order-1 flex flex-col gap-6">
            {/* PDF Viewer with Resource Hook */}
            <SimplePDFViewer
              pdfUrl={pdfUrl}
              isLoading={isPdfLoading}
              error={pdfError?.message || null}
            />

            {/* Description Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-blue">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                <h3 className="text-base sm:text-lg font-bold text-brand-navy font-heading">
                  Description
                </h3>
              </div>
              <div className="prose prose-sm max-w-none text-gray-600">
                <p>{note.noteDescription}</p>
              </div>
            </div>
          </div>

          {/* Sidebar - Below PDF on mobile, side on desktop */}
          <div className="w-full lg:col-span-4 order-2">
            <NotesDetailSidebar note={note} />
          </div>
        </div>
      </div>
    </main>
  )
}
