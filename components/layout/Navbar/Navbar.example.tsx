'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Navbar } from './Navbar'
import { logout } from '@/lib/auth/client'
import type { NavbarProps } from './Navbar.types'

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
  { label: 'Quiz', href: '/quiz' },
]

export function NavbarExample({ initialUser = null }: Pick<NavbarProps, 'initialUser'>) {
  const router = useRouter()
  const [userData, setUserData] = useState(initialUser)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleNotificationClick = () => {
    // Handle notification click
  }

  const handleSignOut = async () => {
    setUserData(null)
    setIsSigningOut(true)

    try {
      await logout()
    } finally {
      router.replace('/signin')
      router.refresh()
    }
  }

  const userName = userData?.fullname || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <Navbar.Provider>
      <Navbar.Frame>
        <Navbar.Container>
          <Navbar.MobileMenuButton />

          <Link href="/" className="flex items-center">
            <Image src="/eg-logo.jpg" alt="EntranceGateway" width={180} height={50} className="h-10 w-auto" priority />
          </Link>

          <Navbar.DesktopNav items={navigationItems} />

          <Navbar.Actions>
            {userData ? (
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
                        <span>Profile & History</span>
                      </div>
                    </Navbar.UserMenuItem>

                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-hidden transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-gray-500">
                          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                        <span>{isSigningOut ? 'Signing out...' : 'Logout'}</span>
                      </div>
                    </button>
                  </Navbar.UserMenu>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-3 relative z-10">
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
          <Link href="/" className="flex items-center">
            <Image src="/eg-logo.jpg" alt="EntranceGateway" width={180} height={50} className="h-10 w-auto" />
          </Link>
          
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
