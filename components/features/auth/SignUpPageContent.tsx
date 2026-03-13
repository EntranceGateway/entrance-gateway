'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
          <div className="lg:hidden flex items-center mb-8">
            <Image src="/eg-logo.jpg" alt="EntranceGateway" width={180} height={50} className="h-10 w-auto" priority />
          </div>

          {/* Form Container */}
          <div className="w-full max-w-md mx-auto">
            {/* Back Button */}
            <div className="mb-6">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-blue transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Back to Home
              </Link>
            </div>
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
