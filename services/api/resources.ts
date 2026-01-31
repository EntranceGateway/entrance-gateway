/**
 * Resource API Service
 * Handles file retrieval from the backend resource endpoint
 * 
 * Endpoint: GET /api/v1/resources/{fileName}
 * 
 * @module resources
 */

/**
 * Fetch resource file as blob for preview/display
 * 
 * @param {string} fileName - Name of the file to fetch (used as-is, not URL encoded)
 * @param {Object} options - Additional options
 * @param {AbortSignal} options.signal - AbortController signal for cancellation
 * @returns {Promise<{blob: Blob, url: string, mimeType: string, fileName: string, size: number}>}
 * 
 * @example
 * const { blob, url, mimeType } = await fetchResourcePreview("my-image.jpg");
 * // Use url in <img src={url} />
 * // Remember to revoke: URL.revokeObjectURL(url)
 */
export const fetchResourcePreview = async (
  fileName: string,
  options: { signal?: AbortSignal } = {}
): Promise<{
  blob: Blob
  url: string
  mimeType: string
  fileName: string
  size: number
}> => {
  if (!fileName) {
    throw new Error('File name is required')
  }

  try {
    // Build endpoint with filename as-is (backend expects unencoded filenames)
    const endpoint = `/api/v1/resources/${fileName}`

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.entrancegateway.com'}${endpoint}`,
      {
        method: 'GET',
        signal: options.signal,
        headers: {
          Accept: '*/*',
        },
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`File not found: ${fileName}`)
      }
      if (response.status === 500) {
        throw new Error('Server error while fetching file')
      }
      throw new Error(`Failed to fetch resource: ${response.statusText}`)
    }

    // Extract metadata from response headers
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const contentDisposition = response.headers.get('content-disposition')
    const contentLength = response.headers.get('content-length')

    // Try to extract original filename from Content-Disposition header
    let originalFileName = fileName
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)
      if (matches && matches[1]) {
        originalFileName = matches[1].replace(/['"]/g, '')
      }
    }

    // Create blob and object URL for preview
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)

    return {
      blob,
      url: objectUrl,
      mimeType: contentType,
      fileName: originalFileName,
      size: contentLength ? parseInt(contentLength, 10) : blob.size,
    }
  } catch (error) {
    // Enhanced error handling
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request was cancelled')
      }
      throw error
    }
    throw new Error('Failed to fetch resource')
  }
}
