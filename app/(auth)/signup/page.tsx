import { Suspense } from 'react'
import { SignUpPageContent } from '@/components/features/auth/SignUpPageContent'
import { CenteredSpinner } from '@/components/shared/Loading'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - EntranceGateway',
  description: 'Create your account and start your journey to academic excellence with EntranceGateway.',
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading..." />}>
      <SignUpPageContent />
    </Suspense>
  )
}
