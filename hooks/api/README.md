# Resource API Hooks

Reusable React hooks for fetching files and images from the EntranceGateway Resource API.

## Installation

```bash
# No installation needed - hooks are part of the project
```

## API Configuration

Set the API URL in your `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.entrancegateway.com
```

## Hooks

### `useResourceFile`

Generic hook for fetching any file type from the Resource API.

**Features:**
- Returns direct URL to the file
- Supports all file types (PDF, DOC, images, etc.)
- Automatic error handling
- Manual refetch capability
- Optional callbacks

**Usage:**

```tsx
import { useResourceFile } from '@/hooks/api'

function DocumentViewer({ fileName }: { fileName: string }) {
  const { url, isLoading, error, refetch } = useResourceFile(fileName)

  if (isLoading) return <Spinner />
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      <a href={url || '#'} download>Download File</a>
      <button onClick={refetch}>Retry</button>
    </div>
  )
}
```

**With Options:**

```tsx
const { url, isLoading, error } = useResourceFile('document.pdf', {
  enabled: true, // Enable/disable fetching
  onSuccess: (url) => console.log('File loaded:', url),
  onError: (error) => console.error('Failed:', error),
})
```

### `useResourceImage`

Specialized hook for fetching and displaying images with blob URL optimization.

**Features:**
- Creates blob URLs for better performance
- Automatic cleanup of blob URLs
- Fallback image support
- Loading states
- Error handling

**Usage:**

```tsx
import { useResourceImage } from '@/hooks/api'

function ProfileImage({ fileName }: { fileName: string }) {
  const { src, isLoading, error } = useResourceImage(fileName, {
    fallbackUrl: '/default-avatar.png'
  })

  return (
    <img 
      src={src || '/default-avatar.png'} 
      alt="Profile"
      className={isLoading ? 'opacity-50 animate-pulse' : ''}
    />
  )
}
```

**With Loading State:**

```tsx
function GalleryImage({ fileName }: { fileName: string }) {
  const { src, isLoading, error, refetch } = useResourceImage(fileName)

  if (error) {
    return (
      <div className="text-center">
        <p className="text-error">Failed to load image</p>
        <button onClick={refetch}>Retry</button>
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Spinner />
        </div>
      )}
      <img 
        src={src || ''} 
        alt="Gallery"
        className="w-full h-full object-cover"
      />
    </div>
  )
}
```

## Complete Examples

### PDF Viewer Component

```tsx
'use client'

import { useResourceFile } from '@/hooks/api'
import { Spinner } from '@/components/shared/Loading'

interface PDFViewerProps {
  fileName: string
}

export function PDFViewer({ fileName }: PDFViewerProps) {
  const { url, isLoading, error, refetch } = useResourceFile(fileName)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
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
      className="w-full h-screen"
      title="PDF Viewer"
    />
  )
}
```

### Image Gallery Component

```tsx
'use client'

import { useResourceImage } from '@/hooks/api'

interface ImageCardProps {
  fileName: string
  alt: string
}

export function ImageCard({ fileName, alt }: ImageCardProps) {
  const { src, isLoading, error } = useResourceImage(fileName, {
    fallbackUrl: '/placeholder.jpg'
  })

  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-sm text-gray-500">Failed to load</p>
        </div>
      )}
      
      <img
        src={src || '/placeholder.jpg'}
        alt={alt}
        className="w-full h-64 object-cover transition-opacity duration-300"
        style={{ opacity: isLoading ? 0.5 : 1 }}
      />
    </div>
  )
}
```

### Downloadable File Component

```tsx
'use client'

import { useResourceFile } from '@/hooks/api'

interface DownloadButtonProps {
  fileName: string
  label?: string
}

export function DownloadButton({ fileName, label }: DownloadButtonProps) {
  const { url, isLoading, error } = useResourceFile(fileName)

  return (
    <a
      href={url || '#'}
      download={fileName}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg
        ${isLoading ? 'bg-gray-300 cursor-wait' : 'bg-brand-gold hover:bg-yellow-400'}
        ${error ? 'bg-error text-white' : 'text-brand-navy'}
      `}
      onClick={(e) => {
        if (!url || isLoading) e.preventDefault()
      }}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" />
          Loading...
        </>
      ) : error ? (
        'Failed to load'
      ) : (
        <>
          <DownloadIcon />
          {label || 'Download'}
        </>
      )}
    </a>
  )
}
```

## API Response

### Success (200 OK)
```http
Content-Type: application/pdf
Content-Length: 1048576
Content-Disposition: inline; filename="document.pdf"
Cache-Control: max-age=3600, must-revalidate, public
```

### Error (404 Not Found)
```json
{
  "message": "File not found: document.pdf",
  "data": null
}
```

## Performance

| Scenario | Response Time |
|----------|---------------|
| Cache Hit | 30-70ms |
| Cache Miss | 500-1000ms |
| Large File | 2-5 seconds |

## Supported File Types

- Documents: `.pdf`, `.doc`, `.docx`, `.txt`, `.xls`, `.xlsx`, `.ppt`, `.pptx`
- Images: `.jpg`, `.jpeg`, `.png`, `.gif`
- Archives: `.zip`, `.rar`

## Best Practices

1. **Use `useResourceImage` for images** - Better performance with blob URLs
2. **Use `useResourceFile` for documents** - Direct URL for downloads/viewing
3. **Always provide fallback URLs** - Better UX during loading/errors
4. **Handle loading states** - Show spinners or skeletons
5. **Handle errors gracefully** - Provide retry buttons
6. **Clean up blob URLs** - Automatic with `useResourceImage`

## TypeScript Support

Both hooks are fully typed with TypeScript:

```typescript
interface UseResourceFileReturn {
  url: string | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

interface UseResourceImageReturn {
  src: string | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}
```

## Troubleshooting

### File not loading?
- Check if `NEXT_PUBLIC_API_URL` is set correctly
- Verify the file name is correct
- Check browser console for CORS errors

### Images not displaying?
- Use `useResourceImage` instead of `useResourceFile` for images
- Provide a fallback URL
- Check if the file extension is supported

### Performance issues?
- Images are cached as blob URLs automatically
- API has Redis caching (24 hours)
- Browser caches responses (1 hour for PDF/images)
