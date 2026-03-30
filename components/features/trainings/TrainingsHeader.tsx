'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/auth'

export function TrainingsHeader() {
  const { isLoggedIn } = useAuth()

  return (
    <section className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <h1 data-role="page-title" className="text-3xl md:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
          Explore Upcoming Trainings
        </h1>
        
        {isLoggedIn && (
          <Link
            href="/my-enrollments"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
            </svg>
            <span className="whitespace-nowrap">My Enrollments</span>
          </Link>
        )}
      </div>
      
      <p className="mt-2 text-gray-600 text-base sm:text-lg max-w-3xl">
        Advance your career with our expert-led technical trainings and exam preparation courses. Secure your spot in the next cohort.
      </p>
    </section>
  )
}
