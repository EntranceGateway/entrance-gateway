import { CartPageContent } from '@/components/features/cart/CartPageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Enrollment Cart | EntranceGateway',
  description: 'Review your selected courses and professional certifications',
}

export default function CartPage() {
  return <CartPageContent />
}
