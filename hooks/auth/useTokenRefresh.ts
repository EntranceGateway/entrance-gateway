'use client'

import { useEffect, useRef, useCallback } from 'react'
import { isAuthenticated } from '@/lib/auth/client'

// Default token TTL assumption (14 minutes)
// Used for the initial schedule when we don't know exact expiresIn
const DEFAULT_REFRESH_DELAY_SECONDS = 14 * 60

// Refresh buffer — refresh this many seconds before expiry
const REFRESH_BUFFER_SECONDS = 60

/**
 * Proactive token refresh hook
 *
 * Schedules a token refresh before the access token expires,
 * preventing 401 errors during active user sessions.
 *
 * - On mount: schedules an initial refresh after ~14 minutes (default token TTL)
 * - After each successful refresh: uses the actual `expiresIn` to schedule precisely
 * - Does NOT refresh immediately on mount (the token is already valid after login)
 */
export function useTokenRefresh() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMountedRef = useRef(true)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const doRefresh = useCallback(async () => {
    if (!isMountedRef.current || !isAuthenticated()) {
      return
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        // Refresh failed — user will be prompted to re-login on next API call
        return
      }

      const data = await response.json()
      const expiresIn: number = data.expiresIn // seconds

      if (!isMountedRef.current || !expiresIn || expiresIn <= 0) {
        return
      }

      // Schedule next refresh before expiry
      const refreshInSeconds = expiresIn > REFRESH_BUFFER_SECONDS * 2
        ? expiresIn - REFRESH_BUFFER_SECONDS
        : Math.max(Math.floor(expiresIn / 2), 10)

      clearTimer()
      timerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          doRefresh()
        }
      }, refreshInSeconds * 1000)
    } catch {
      // Network error — silently fail, reactive refresh will handle it
    }
  }, [clearTimer])

  useEffect(() => {
    isMountedRef.current = true

    if (isAuthenticated()) {
      // Don't refresh immediately — the token is valid after login
      // Schedule the first refresh after the default delay
      clearTimer()
      timerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          doRefresh()
        }
      }, DEFAULT_REFRESH_DELAY_SECONDS * 1000)
    }

    return () => {
      isMountedRef.current = false
      clearTimer()
    }
  }, [doRefresh, clearTimer])
}
