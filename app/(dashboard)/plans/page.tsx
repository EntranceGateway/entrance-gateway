import type { Metadata } from 'next'
import { SubscriptionPlansContent } from '@/components/features/subscription'
import { getMySubscription, getSubscriptionPlans } from '@/services/server/subscription.server'

export const metadata: Metadata = {
  title: 'Subscription Plans | EntranceGateway',
  description: 'Choose an EntranceGateway subscription plan to unlock premium quizzes, higher monthly limits, analytics, and mentor support.',
}

export default async function PlansPage() {
  const [plans, subscription] = await Promise.all([
    getSubscriptionPlans(),
    getMySubscription(),
  ])

  return <SubscriptionPlansContent initialPlans={plans} initialSubscription={subscription} />
}
