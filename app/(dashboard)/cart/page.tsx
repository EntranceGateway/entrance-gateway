import { CartPageContent } from '@/components/features/cart/CartPageContent'
import { getCart } from '@/services/server/cart.server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Cart | EntranceGateway',
  description: 'Review your selected quizzes before checkout',
}

export default async function CartPage() {
  // Fetch cart data on server (SSR)
  const initialData = await getCart().catch(() => null)

  return <CartPageContent initialData={initialData} />
}
