import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - EntranceGateway',
  description: 'Sign in or create an account to access EntranceGateway.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
