import { Suspense } from 'react'
import { VerifyOtpPageContent } from '@/components/features/auth/VerifyOtpPageContent'
import { CenteredSpinner } from '@/components/shared/Loading'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify Account - EntranceGateway',
  description: 'Verify your account with the OTP code sent to your email.',
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<CenteredSpinner size="lg" text="Loading..." />}>
      <VerifyOtpPageContent />
    </Suspense>
  )
}
