import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserId, isAuthenticated, logout as logoutClient } from '@/lib/auth/client'

export function useAuth() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    setIsLoading(true)
    
    const authenticated = isAuthenticated()
    const id = getUserId()
    
    setIsLoggedIn(authenticated)
    setUserId(id)
    setIsLoading(false)
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

