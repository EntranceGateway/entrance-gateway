import { headers } from 'next/headers'
import { NavbarServer } from './Navbar'
import { Footer } from './Footer'

const AUTH_PATH_PREFIXES = ['/signup', '/signin', '/verify-otp']

export async function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers()
  const pathname = requestHeaders.get('x-pathname') || '/'

  const isAuthPage = AUTH_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  if (isAuthPage) {
    return <div className="h-screen overflow-hidden">{children}</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarServer />
      {children}
      <Footer />
    </div>
  )
}
