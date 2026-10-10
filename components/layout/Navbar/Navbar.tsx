'use client'

import { useState, createContext, use, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import type { NavbarProps, NavItem } from './Navbar.types'

// Context for navbar state
interface NavbarContextValue {
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  isUserMenuOpen: boolean
  toggleUserMenu: () => void
  closeMobileMenu: () => void
}

const NavbarContext = createContext<NavbarContextValue | null>(null)

// Main Navbar Frame
function NavbarFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <nav className={cn('relative bg-white border-b border-gray-200 sticky top-0 z-50', className)}>
      {children}
    </nav>
  )
}

// Container
function NavbarContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between gap-4">
        {children}
      </div>
    </div>
  )
}

// Mobile Menu Button
function NavbarMobileMenuButton() {
  const { isMobileMenuOpen, toggleMobileMenu } = use(NavbarContext)!

  return (
    <div className="flex items-center lg:hidden">
      <button
        type="button"
        onClick={toggleMobileMenu}
        aria-expanded={isMobileMenuOpen}
        aria-label="Toggle navigation menu"
        className="relative inline-flex items-center justify-center rounded-lg p-2.5 text-gray-600 hover:bg-gray-100 hover:text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 transition-all"
      >
        {/* Hamburger Icon */}
        <div className="w-6 h-5 flex flex-col justify-between">
          <span
            className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </div>
      </button>
    </div>
  )
}

// Logo with Text
function NavbarLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex items-center">
      <span className="text-lg font-semibold text-brand-navy">EntranceGateway</span>
    </div>
  )
}

// Desktop Navigation
function NavbarDesktopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  
  return (
    <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
      <div className="flex space-x-1">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative rounded-md px-3 py-2 text-sm font-medium transition-colors',
                'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-gold after:scale-x-0 after:transition-transform after:duration-200',
                'hover:after:scale-x-100',
                isActive
                  ? 'text-brand-navy after:scale-x-100'
                  : 'text-gray-600 hover:text-brand-navy'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// Actions (Notifications + User Menu)
function NavbarActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {children}
    </div>
  )
}

// Notification Button
function NavbarNotificationButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-brand-navy focus:outline-2 focus:outline-offset-2 focus:outline-brand-blue transition-colors"
    >
      <span className="absolute -inset-1.5" />
      <span className="sr-only">View notifications</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
        className="size-5"
      >
        <path
          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

// User Menu Button
function NavbarUserMenuButton({ avatar, name }: { avatar: string; name: string }) {
  const { isUserMenuOpen, toggleUserMenu } = use(NavbarContext)!

  // Check if avatar is a URL or a single character (initial)
  const isInitial = avatar.length === 1

  return (
    <div className="relative">
      <button
        onClick={toggleUserMenu}
        className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 pr-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
      >
        {isInitial ? (
          <div className="size-8 rounded-full bg-brand-blue flex items-center justify-center text-white text-sm font-bold ring-2 ring-gray-200">
            {avatar}
          </div>
        ) : (
          <Image
            src={avatar}
            alt={name}
            width={32}
            height={32}
            className="size-8 rounded-full bg-gray-200 ring-2 ring-gray-200"
          />
        )}
        <div className="hidden sm:block max-w-24 xl:max-w-32 text-left">
          <div className="truncate text-sm font-medium text-gray-900" title={name}>{name}</div>
          <div className="text-xs text-gray-500">User</div>
        </div>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-4 text-gray-400"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}

// User Menu Dropdown
function NavbarUserMenu({ children }: { children: React.ReactNode }) {
  const { isUserMenuOpen } = use(NavbarContext)!

  if (!isUserMenuOpen) return null

  return (
    <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
      {children}
    </div>
  )
}

// User Menu Item
function NavbarUserMenuItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-hidden transition-colors"
    >
      {children}
    </Link>
  )
}

// Mobile Menu
function NavbarMobileMenu({ items, isAuthenticated = false }: { items: NavItem[]; isAuthenticated?: boolean }) {
  const { isMobileMenuOpen, closeMobileMenu } = use(NavbarContext)!
  const pathname = usePathname()

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Slide-in Menu - Half Width */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[75%] max-w-sm bg-white z-50 lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto flex flex-col">
          {/* Menu Header with Close Button */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-brand-navy">
            <Image src="/eg-logo.jpg" alt="EntranceGateway" width={140} height={40} className="h-8 w-auto" />
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-1 px-4 py-6">
              {items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    aria-current={isActive ? 'page' : undefined}
                    className={`block rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-brand-navy bg-brand-gold/20 border-l-4 border-brand-gold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-brand-navy hover:border-l-4 hover:border-brand-blue/30'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Mobile Menu Footer - Only show auth buttons if not authenticated */}
          {!isAuthenticated && (
            <div className="border-t border-gray-200 px-4 py-6 space-y-3 bg-gray-50">
              <Link
                href="/signin"
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold rounded-lg transition-colors shadow-sm"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-brand-navy text-brand-navy font-semibold rounded-lg hover:bg-brand-navy hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// Provider Component
function NavbarProvider({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev)
  const toggleUserMenu = () => setIsUserMenuOpen((prev) => !prev)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('nav')) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isUserMenuOpen])

  return (
    <NavbarContext.Provider value={{ isMobileMenuOpen, toggleMobileMenu, isUserMenuOpen, toggleUserMenu, closeMobileMenu }}>
      {children}
    </NavbarContext.Provider>
  )
}

// Export individual components
export {
  NavbarProvider,
  NavbarFrame,
  NavbarContainer,
  NavbarMobileMenuButton,
  NavbarLogo,
  NavbarDesktopNav,
  NavbarActions,
  NavbarNotificationButton,
  NavbarUserMenuButton,
  NavbarUserMenu,
  NavbarUserMenuItem,
  NavbarMobileMenu,
}

// Compound Component Export
export const Navbar = {
  Provider: NavbarProvider,
  Frame: NavbarFrame,
  Container: NavbarContainer,
  MobileMenuButton: NavbarMobileMenuButton,
  Logo: NavbarLogo,
  DesktopNav: NavbarDesktopNav,
  Actions: NavbarActions,
  NotificationButton: NavbarNotificationButton,
  UserMenuButton: NavbarUserMenuButton,
  UserMenu: NavbarUserMenu,
  UserMenuItem: NavbarUserMenuItem,
  MobileMenu: NavbarMobileMenu,
}
