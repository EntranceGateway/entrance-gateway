'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from './Navbar'
import { fetchUserProfile } from '@/services/client/user.client'
import { isAuthenticated, getUserId } from '@/lib/auth/client'
import type { User } from '@/types/user.types'

/**
 * Example usage of the Navbar compound component
 * 
 * This demonstrates the composition pattern where you explicitly
 * compose the navbar structure using subcomponents.
 */

const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'Syllabus', href: '/syllabus' },
  { label: 'Notes', href: '/notes' },
  { label: 'Old Questions', href: '/questions' },
  { label: 'Colleges', href: '/colleges' },
  { label: 'Courses', href: '/courses' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Trainings', href: '/trainings' },
]

export function NavbarExample() {
  const [userData, setUserData] = useState<User | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Check if user is authenticated
    if (mounted && isAuthenticated()) {
      loadUserData()
    } else if (mounted) {
      setIsLoadingUser(false)
    }
  }, [mounted])

  const loadUserData = async () => {
    try {
      const response = await fetchUserProfile()
      setUserData(response.data)
      console.log('👤 Navbar: User data loaded')
    } catch (error) {
      console.error('❌ Navbar: Failed to load user data:', error)
    } finally {
      setIsLoadingUser(false)
    }
  }

  const handleNotificationClick = () => {
    console.log('Notification clicked')
  }

  const handleSignOut = async () => {
    try {
      // Call logout API to clear cookies
      await fetch('/api/auth/logout', { method: 'POST' })
      console.log('👋 User signed out')
      window.location.href = '/signin'
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect even if logout fails
      window.location.href = '/signin'
    }
  }

  // Get user display name
  const userName = userData?.fullname || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Navbar.Provider>
        <Navbar.Frame>
          <Navbar.Container>
            <Navbar.MobileMenuButton />
            <Navbar.Logo src="/next.svg" alt="EntranceGateway" />
            <Navbar.DesktopNav items={navigationItems} />
            <Navbar.Actions>
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            </Navbar.Actions>
          </Navbar.Container>
          <Navbar.MobileMenu items={navigationItems} isAuthenticated={false} />
        </Navbar.Frame>
      </Navbar.Provider>
    )
  }

  return (
    <Navbar.Provider>
      <Navbar.Frame>
        <Navbar.Container>
          {/* Mobile menu button */}
          <Navbar.MobileMenuButton />

          {/* Logo */}
          <Navbar.Logo
            src="/next.svg"
            alt="EntranceGateway"
          />

          {/* Desktop navigation */}
          <Navbar.DesktopNav items={navigationItems} />

          {/* Actions (Notifications + User Menu OR Auth Buttons) */}
          <Navbar.Actions>
            {isLoadingUser ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : userData ? (
              <>
                <Navbar.NotificationButton onClick={handleNotificationClick} />
                
                <div className="relative">
                  <Navbar.UserMenuButton
                    avatar={userInitial}
                    name={userName}
                  />
                  
                  <Navbar.UserMenu>
                    <Navbar.UserMenuItem href="/profile">
                      <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-gray-500">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <span>Profile</span>
                      </div>
                    </Navbar.UserMenuItem>
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-hidden transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-gray-500">
                          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                        <span>Logout</span>
                      </div>
                    </button>
                  </Navbar.UserMenu>
                </div>
              </>
            ) : (
              // Desktop Auth Buttons - Show when not authenticated
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/signin"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-brand-navy transition-colors rounded-lg hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-bold bg-brand-gold hover:bg-yellow-400 text-brand-navy rounded-lg transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </Navbar.Actions>
        </Navbar.Container>

        {/* Mobile menu - Pass user authentication state */}
        <Navbar.MobileMenu items={navigationItems} isAuthenticated={!!userData} />
      </Navbar.Frame>
    </Navbar.Provider>
  )
}

/**
 * Alternative: Custom variant with different structure
 * 
 * This shows how you can compose different navbar variants
 * using the same building blocks.
 */
export function SimpleNavbar() {
  return (
    <Navbar.Provider>
      <Navbar.Frame className="bg-brand-navy">
        <Navbar.Container>
          <Navbar.Logo
            src="/next.svg"
            alt="Your Company"
          />
          
          <Navbar.DesktopNav
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ]}
          />
        </Navbar.Container>
      </Navbar.Frame>
    </Navbar.Provider>
  )
}
