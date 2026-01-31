'use client'

import { usePathname } from 'next/navigation'
import { NavbarExample } from './Navbar/Navbar.example'
import { Footer } from './Footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Check if current path is an auth page
  const isAuthPage = pathname?.startsWith('/signup') || pathname?.startsWith('/signin')

  // Auth pages: no navbar/footer, full screen
  if (isAuthPage) {
    return <div className="h-screen overflow-hidden">{children}</div>
  }

  // Regular pages: with navbar/footer
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarExample />
      {children}
      <Footer />
    </div>
  )
}
