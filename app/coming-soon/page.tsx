import type { Metadata } from 'next'
import { ComingSoonContent } from '@/components/features/coming-soon/ComingSoonContent'

export const metadata: Metadata = {
  title: 'Coming Soon - EntranceGateway',
  description: "We're building the ultimate digital gateway for entrance exam excellence in Nepal.",
}

export default function ComingSoonPage() {
  return <ComingSoonContent />
}
