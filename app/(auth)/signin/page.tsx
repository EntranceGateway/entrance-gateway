import { Suspense } from 'react'
import { SignInPageContent } from '@/components/features/auth/SignInPageContent'
import { CenteredSpinner } from '@/components/shared/Loading'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - EntranceGateway',
  description: 'Sign in to your EntranceGateway account and continue your learning journey.',
}

export default function SignInPage() {
  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading..." />}>
      <SignInPageContent />
    </Suspense>
  )
}
