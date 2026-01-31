# Usage Examples

## Quick Start

### 1. Display an Image

```tsx
import { useResourceImage } from '@/hooks/api'

function StudentProfile() {
  const { src, isLoading } = useResourceImage('profile.jpg', {
    fallbackUrl: '/default-avatar.png'
  })

  return (
    <img 
      src={src || '/default-avatar.png'} 
      alt="Student"
      className={isLoading ? 'opacity-50' : ''}
    />
  )
}
```

### 2. Download a PDF

```tsx
import { useResourceFile } from '@/hooks/api'

function DownloadNotes() {
  const { url, isLoading } = useResourceFile('notes.pdf')

  return (
    <a 
      href={url || '#'} 
      download
      className={isLoading ? 'pointer-events-none opacity-50' : ''}
    >
      {isLoading ? 'Loading...' : 'Download Notes'}
    </a>
  )
}
```

### 3. View PDF in Iframe

```tsx
import { useResourceFile } from '@/hooks/api'

function PDFViewer({ fileName }: { fileName: string }) {
  const { url, isLoading, error } = useResourceFile(fileName)

  if (isLoading) return <div>Loading PDF...</div>
  if (error) return <div>Error: {error.message}</div>

  return <iframe src={url || ''} className="w-full h-screen" />
}
```

## Real-World Examples

### Image Gallery with Loading States

```tsx
'use client'

import { useResourceImage } from '@/hooks/api'
import { Spinner } from '@/components/shared/Loading'

interface GalleryImageProps {
  fileName: string
  alt: string
}

export function GalleryImage({ fileName, alt }: GalleryImageProps) {
  const { src, isLoading, error, refetch } = useResourceImage(fileName)

  return (
    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size="md" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <p className="text-sm text-error">Failed to load</p>
          <button 
            onClick={refetch}
            className="text-xs text-brand-blue hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Image */}
      {src && (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  )
}
```

### Document Download Card

```tsx
'use client'

import { useResourceFile } from '@/hooks/api'

interface DocumentCardProps {
  fileName: string
  title: string
  description: string
}

export function DocumentCard({ fileName, title, description }: DocumentCardProps) {
  const { url, isLoading, error } = useResourceFile(fileName)

  const getFileIcon = () => {
    if (fileName.endsWith('.pdf')) return '📄'
    if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return '📝'
    if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) return '📊'
    return '📁'
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <span className="text-4xl">{getFileIcon()}</span>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-brand-navy mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          
          {error ? (
            <p className="text-sm text-error">Failed to load file</p>
          ) : (
            <a
              href={url || '#'}
              download={fileName}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg
                ${isLoading 
                  ? 'bg-gray-300 cursor-wait' 
                  : 'bg-brand-gold hover:bg-yellow-400 text-brand-navy'
                }
              `}
              onClick={(e) => {
                if (!url || isLoading) e.preventDefault()
              }}
            >
              {isLoading ? 'Loading...' : 'Download'}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
```

### Conditional Fetching

```tsx
'use client'

import { useState } from 'react'
import { useResourceImage } from '@/hooks/api'

export function LazyImage({ fileName }: { fileName: string }) {
  const [shouldLoad, setShouldLoad] = useState(false)
  
  const { src, isLoading } = useResourceImage(fileName, {
    enabled: shouldLoad, // Only fetch when enabled
    fallbackUrl: '/placeholder.jpg'
  })

  return (
    <div>
      {!shouldLoad ? (
        <button 
          onClick={() => setShouldLoad(true)}
          className="bg-brand-blue text-white px-4 py-2 rounded"
        >
          Load Image
        </button>
      ) : (
        <img 
          src={src || '/placeholder.jpg'} 
          alt="Lazy loaded"
          className={isLoading ? 'opacity-50' : ''}
        />
      )}
    </div>
  )
}
```

### Multiple Files

```tsx
'use client'

import { useResourceFile } from '@/hooks/api'

export function CourseResources() {
  const notes = useResourceFile('lecture-notes.pdf')
  const slides = useResourceFile('slides.pptx')
  const assignment = useResourceFile('assignment.docx')

  const resources = [
    { name: 'Lecture Notes', hook: notes },
    { name: 'Slides', hook: slides },
    { name: 'Assignment', hook: assignment },
  ]

  return (
    <div className="space-y-4">
      {resources.map(({ name, hook }) => (
        <div key={name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="font-medium">{name}</span>
          {hook.isLoading ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : hook.error ? (
            <span className="text-sm text-error">Error</span>
          ) : (
            <a 
              href={hook.url || '#'} 
              download
              className="text-brand-blue hover:underline"
            >
              Download
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
```

### With Callbacks

```tsx
'use client'

import { useResourceImage } from '@/hooks/api'
import { toast } from 'react-hot-toast'

export function ProfilePicture({ fileName }: { fileName: string }) {
  const { src, isLoading } = useResourceImage(fileName, {
    fallbackUrl: '/default-avatar.png',
    onSuccess: (url) => {
      console.log('Image loaded successfully:', url)
      toast.success('Profile picture loaded')
    },
    onError: (error) => {
      console.error('Failed to load image:', error)
      toast.error('Failed to load profile picture')
    }
  })

  return (
    <div className="relative w-32 h-32 rounded-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img 
        src={src || '/default-avatar.png'} 
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </div>
  )
}
```

## Integration with Existing Components

### Update PDFViewer Component

```tsx
// components/shared/PDFViewer/PDFViewer.tsx
'use client'

import { useResourceFile } from '@/hooks/api'
import { Spinner } from '@/components/shared/Loading'

export function PDFViewer({ fileName }: { fileName: string }) {
  const { url, isLoading, error, refetch } = useResourceFile(fileName)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[85vh] bg-gray-100">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[85vh] bg-gray-100">
        <p className="text-error mb-4">{error.message}</p>
        <button 
          onClick={refetch}
          className="bg-brand-blue text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <iframe
      src={url || ''}
      className="w-full h-[85vh] rounded-lg"
      title="PDF Viewer"
    />
  )
}
```

### Update Image Components

```tsx
// components/features/home/HomeSimpleSteps.tsx
'use client'

import { useResourceImage } from '@/hooks/api'

export function HomeSimpleSteps() {
  const classroom = useResourceImage('classroom.jpg')
  const studying = useResourceImage('studying.jpg')

  return (
    <section>
      {/* ... other content ... */}
      
      <div className="rounded-3xl overflow-hidden group">
        <img
          src={classroom.src || '/classroom.jpg'}
          alt="Classroom"
          className={`
            w-full h-full object-cover 
            transition-transform duration-500 
            group-hover:scale-110
            ${classroom.isLoading ? 'opacity-50' : ''}
          `}
        />
      </div>
      
      <div className="rounded-3xl overflow-hidden group">
        <img
          src={studying.src || '/studying.jpg'}
          alt="Studying"
          className={`
            w-full h-full object-cover 
            transition-transform duration-500 
            group-hover:scale-110
            ${studying.isLoading ? 'opacity-50' : ''}
          `}
        />
      </div>
    </section>
  )
}
```
