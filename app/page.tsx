import { Footer } from '@/components/layout/Footer'
import { NavbarServer } from '@/components/layout/Navbar'
import Home, { metadata } from './(dashboard)/page'

export { metadata }

export default function RootPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <Home />
      <Footer />
    </div>
  )
}
