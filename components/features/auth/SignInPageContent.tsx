'use client'

import Link from 'next/link'
import { SignInForm } from './SignInForm'
import { AuthSidebar } from './AuthSidebar'

export function SignInPageContent() {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Left Sidebar - Hidden on mobile, fixed on desktop */}
      <AuthSidebar />

      {/* Right Content - Form (Scrollable) */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white overflow-y-auto">
        <div className="flex-1 flex items-center justify-center py-12 px-6 sm:px-12 lg:px-16 xl:px-24">
          {/* Form Container */}
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center sm:justify-start items-center gap-2 mb-8">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-8 text-brand-navy">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
              </svg>
              <span className="font-bold text-xl text-brand-navy font-heading">EntranceGateway</span>
            </div>

            {/* Header */}
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-brand-navy font-heading">
                Sign In
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Welcome back to your learning dashboard.
              </p>
            </div>

            {/* Sign In Form */}
            <SignInForm />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors gap-2"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors gap-2"
              >
                <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    clipRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    fillRule="evenodd"
                  />
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600 pt-4">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-bold text-brand-blue hover:text-brand-navy hover:underline transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
