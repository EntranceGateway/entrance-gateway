import { NavbarServer } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarServer />
      {children}
      <Footer />
    </div>
  )
}
