import { useState, useEffect } from 'react'

interface UseResourceImageOptions {
  enabled?: boolean
  fallbackUrl?: string
  onSuccess?: (url: string) => void
  onError?: (error: Error) => void
}

interface UseResourceImageReturn {
  src: string | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook to fetch and display images from the Resource API
 * Creates a blob URL for better performance and caching
 * 
 * @param fileName - Name of the image file (e.g., "profile.jpg", "banner.png")
 * @param options - Optional configuration including fallback URL
 * @returns Object containing image src, loading state, error, and refetch function
 * 
 * @example
 * ```tsx
 * const { src, isLoading, error } = useResourceImage('profile.jpg', {
 *   fallbackUrl: '/default-avatar.png'
 * })
 * 
 * return (
 *   <img 
 *     src={src || '/default-avatar.png'} 
 *     alt="Profile"
 *     className={isLoading ? 'opacity-50' : ''}
 *   />
 * )
 * ```
 */
export function useResourceImage(
  fileName: string | null | undefined,
  options: UseResourceImageOptions = {}
): UseResourceImageReturn {
  const { enabled = true, fallbackUrl, onSuccess, onError } = options

  const [src, setSrc] = useState<string | null>(fallbackUrl || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1)
  }

  useEffect(() => {
    // Reset to fallback if fileName is null/undefined or disabled
    if (!fileName || !enabled) {
      setSrc(fallbackUrl || null)
      setIsLoading(false)
      setError(null)
      return
    }

    let objectUrl: string | null = null

    const fetchImage = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.entrancegateway.com'
        const imageUrl = `${apiUrl}/api/v1/resources/${encodeURIComponent(fileName)}`

        const response = await fetch(imageUrl)

        if (!response.ok) {
          throw new Error(`Image not found: ${fileName}`)
        }

        // Create blob URL for better performance
        const blob = await response.blob()
        objectUrl = URL.createObjectURL(blob)

        setSrc(objectUrl)
        onSuccess?.(objectUrl)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch image')
        setError(error)
        setSrc(fallbackUrl || null)
        onError?.(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchImage()

    // Cleanup: revoke blob URL when component unmounts or fileName changes
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [fileName, enabled, refetchTrigger, fallbackUrl, onSuccess, onError])

  return { src, isLoading, error, refetch }
}
