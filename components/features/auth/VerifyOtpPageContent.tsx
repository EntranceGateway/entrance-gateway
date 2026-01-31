'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { OtpForm } from './OtpForm'
import { getPendingEmail } from '@/lib/auth/client'

export function VerifyOtpPageContent() {
  const [email, setEmail] = useState<string>('student@example.com')

  useEffect(() => {
    const pendingEmail = getPendingEmail()
    if (pendingEmail) {
      setEmail(pendingEmail)
    }
  }, [])

  // Mask email for privacy (show first 2 chars and domain)
  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@')
    if (localPart.length <= 2) return email
    return `${localPart.substring(0, 2)}${'*'.repeat(localPart.length - 2)}@${domain}`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simplified Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center md:justify-start h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-9 text-brand-blue group-hover:scale-110 transition-transform duration-200">
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                </svg>
                <div className="flex flex-col">
                  <span className="font-bold text-xl tracking-tight text-brand-navy leading-none font-heading">
                    EntranceGateway
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-gray-500 mt-0.5">
                    Secure Login
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
            {/* Top Gradient Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-brand-navy via-brand-blue to-brand-navy" />

            {/* Card Content */}
            <div className="p-8 sm:p-10">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-8 text-brand-blue">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-navy tracking-tight font-heading mb-2">
                  Verify Your Account
                </h2>
                <p className="text-sm text-gray-500">
                  We've sent a 6-digit code to your email
                  <br />
                  <span className="font-medium text-gray-700">{maskEmail(email)}</span>
                </p>
              </div>

              {/* OTP Form */}
              <OtpForm />
            </div>

            {/* Card Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-center">
              <Link
                href="/signin"
                className="flex items-center text-sm font-medium text-gray-500 hover:text-brand-navy transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 mr-2">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Back to Sign In
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-gray-400">
            © 2024 EntranceGateway Education Pvt Ltd. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  )
}
