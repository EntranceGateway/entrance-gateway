import { useState, useEffect, useRef } from 'react'
import { fetchResourcePreview } from '@/services/api'

interface UseResourceFileOptions {
  enabled?: boolean
  onSuccess?: (url: string) => void
  onError?: (error: Error) => void
}

interface UseResourceFileReturn {
  url: string | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook to fetch files from the Resource API
 * 
 * @param fileName - Name of the file to fetch (e.g., "document.pdf", "image.jpg")
 * @param options - Optional configuration
 * @returns Object containing url, loading state, error, and refetch function
 * 
 * @example
 * ```tsx
 * const { url, isLoading, error } = useResourceFile('document.pdf')
 * 
 * if (isLoading) return <Spinner />
 * if (error) return <div>Error: {error.message}</div>
 * if (url) return <img src={url} alt="Document" />
 * ```
 */
export function useResourceFile(
  fileName: string | null | undefined,
  options: UseResourceFileOptions = {}
): UseResourceFileReturn {
  const { enabled = true, onSuccess, onError } = options

  const [url, setUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  // Use refs to store callbacks to avoid dependency issues
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)

  // Update refs when callbacks change
  useEffect(() => {
    onSuccessRef.current = onSuccess
    onErrorRef.current = onError
  }, [onSuccess, onError])

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1)
  }

  useEffect(() => {
    // Reset state if fileName is null/undefined or disabled
    if (!fileName || !enabled) {
      setUrl(null)
      setIsLoading(false)
      setError(null)
      return
    }

    let objectUrl: string | null = null
    let isMounted = true
    const abortController = new AbortController()

    const fetchFile = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Use the resource service to fetch the file
        const result = await fetchResourcePreview(fileName, {
          signal: abortController.signal,
        })

        // Only update state if component is still mounted
        if (isMounted) {
          objectUrl = result.url
          setUrl(result.url)
          onSuccessRef.current?.(result.url)
        }
      } catch (err) {
        // Don't set error if request was aborted or component unmounted
        if (!isMounted || (err instanceof Error && err.message.includes('cancel'))) {
          return
        }
        if (isMounted) {
          const error = err instanceof Error ? err : new Error('Failed to fetch file')
          setError(error)
          onErrorRef.current?.(error)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchFile()

    // Cleanup: revoke object URL when component unmounts or fileName changes
    return () => {
      isMounted = false
      abortController.abort()
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [fileName, enabled, refetchTrigger])

  return { url, isLoading, error, refetch }
}
