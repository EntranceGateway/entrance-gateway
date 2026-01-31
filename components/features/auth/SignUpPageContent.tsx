'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SignUpForm } from './SignUpForm'
import { AuthSidebar } from './AuthSidebar'

export function SignUpPageContent() {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Left Sidebar - Hidden on mobile, fixed on desktop */}
      <AuthSidebar />

      {/* Right Content - Form (Scrollable) */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-24 xl:px-32">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-8 text-brand-blue">
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
            </svg>
            <span className="font-bold text-xl text-brand-navy font-heading">EntranceGateway</span>
          </div>

          {/* Form Container */}
          <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-brand-navy font-heading mb-2">
                Create Account
              </h1>
              <p className="text-gray-500 text-sm">
                Fill in your details to start your preparation.
              </p>
            </div>

            {/* Sign Up Form */}
            <SignUpForm />

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/signin"
                  className="font-semibold text-brand-blue hover:text-brand-navy transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Support Link */}
            <div className="mt-12 border-t border-gray-100 pt-6 text-center mb-8">
              <p className="text-xs text-gray-400">
                Need help with registration?{' '}
                <Link href="/contact" className="text-gray-500 hover:text-gray-700 underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
