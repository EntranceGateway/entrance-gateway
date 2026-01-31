'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

interface SimplePDFViewerProps {
  pdfUrl: string | null
  isLoading?: boolean
  error?: string | null
  className?: string
}

export function SimplePDFViewer({ pdfUrl, isLoading, error, className }: SimplePDFViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50))
  const handleResetZoom = () => setZoom(100)

  const handleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        'bg-white rounded-xl shadow-md border border-gray-200 flex flex-col h-[80vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] min-h-[600px] overflow-hidden',
        isFullscreen && 'rounded-none h-screen',
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-3 sm:px-4 sm:py-3 bg-white border-b border-gray-200 z-10">
        {/* Zoom Controls */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="p-1.5 text-gray-600 hover:bg-white hover:shadow-sm rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z" />
            </svg>
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2 sm:px-3 text-xs sm:text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm rounded transition-all min-w-[2.5rem] sm:min-w-[3rem]"
            title="Reset Zoom"
            aria-label="Reset Zoom"
          >
            {zoom}%
          </button>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="p-1.5 text-gray-600 hover:bg-white hover:shadow-sm rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2z" />
            </svg>
          </button>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={handleFullscreen}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          )}
        </button>
      </div>

      {/* PDF Content Area */}
      <div className="flex-1 bg-gray-100 overflow-auto flex justify-center">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center w-full">
            <div className="text-center">
              <div
                className="inline-block size-12 animate-spin rounded-full border-8 border-solid border-brand-blue border-r-transparent"
                role="status"
                aria-label="Loading PDF"
              >
                <span className="sr-only">Loading PDF...</span>
              </div>
              <p className="mt-4 text-sm text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex items-center justify-center w-full p-6">
            <div className="bg-error/10 border border-error text-error p-6 rounded-lg max-w-md">
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                <div>
                  <h3 className="font-bold text-lg mb-1">Failed to load PDF</h3>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PDF Object */}
        {pdfUrl && !isLoading && !error && (
          <div
            className="bg-white shadow-lg w-full h-full transition-transform duration-200"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <object
              data={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
              type="application/pdf"
              className="w-full h-full"
              aria-label="PDF Document Viewer"
            >
              <embed
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                type="application/pdf"
                className="w-full h-full"
              />
            </object>
          </div>
        )}

        {/* No PDF State */}
        {!pdfUrl && !isLoading && !error && (
          <div className="flex items-center justify-center w-full">
            <div className="text-center text-gray-500">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="size-16 mx-auto mb-4 text-gray-300"
              >
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm">No PDF file available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
