import { Suspense } from 'react'
import { NavbarServer } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PaymentStatusBanner } from '@/components/features/subscription/PaymentStatusBanner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarServer />
      <Suspense fallback={null}>
        <PaymentStatusBanner />
      </Suspense>
      {children}
      <Footer />
    </div>
  )
}
