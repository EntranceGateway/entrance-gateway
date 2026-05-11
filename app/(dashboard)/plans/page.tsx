import type { Metadata } from 'next'
import { SubscriptionPlansContent } from '@/components/features/subscription'
import { getSubscriptionPlans, getMySubscription } from '@/services/server/subscription.server'
import { getEntranceTypes } from '@/services/server/entranceTypes.server'

export const metadata: Metadata = {
  title: 'Subscription Plans | EntranceGateway',
  description: 'Choose an EntranceGateway subscription plan to unlock premium quizzes, higher monthly limits, analytics, and mentor support.',
}

export default async function PlansPage() {
  const [plans, subscription, entranceTypes] = await Promise.all([
    getSubscriptionPlans(),
    getMySubscription(),
    getEntranceTypes(),
  ])

  const entranceOptions = entranceTypes
    .filter((entrance) => Boolean(entrance.slug))
    .map((entrance) => ({
      slug: entrance.slug,
      name: entrance.entranceName || entrance.slug,
    }))

  return (
    <SubscriptionPlansContent
      initialPlans={plans}
      initialSubscription={subscription}
      initialEntranceOptions={entranceOptions}
    />
  )
}
