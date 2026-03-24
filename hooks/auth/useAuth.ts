import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserId, logout as logoutClient } from '@/lib/auth/client'
import { fetchAccessToken } from '@/lib/auth/cookie'

export function useAuth() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    setIsLoading(true)

    try {
      // Check auth via API proxy (reads httpOnly cookies)
      const token = await fetchAccessToken()
      const authenticated = !!token
      const id = getUserId()

      setIsLoggedIn(authenticated)
      setUserId(id)
    } catch {
      setIsLoggedIn(false)
      setUserId(null)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logoutClient()
      setIsLoggedIn(false)
      setUserId(null)
      router.push('/signin')
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if API call fails
      setIsLoggedIn(false)
      setUserId(null)
      router.push('/signin')
    }
  }

  return {
    isLoggedIn,
    isLoading,
    userId,
    logout,
    checkAuth,
  }
}

