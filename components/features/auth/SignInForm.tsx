'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FormInput } from '@/components/shared/Form/FormInput'
import { Spinner } from '@/components/shared/Loading'
import { login } from '@/lib/auth/client'
import { useToast } from '@/components/shared/Toast'

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { success, error: showError } = useToast()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Validation functions
  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Email should be valid'
    return ''
  }

  const validatePassword = (value: string): string => {
    if (!value) return 'Password is required'
    if (value.length < 8) return 'Password must be at least 8 characters long'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})

    // Validate all fields
    const errors: Record<string, string> = {}
    
    const emailError = validateEmail(formData.email)
    if (emailError) errors.email = emailError

    const passwordError = validatePassword(formData.password)
    if (passwordError) errors.password = passwordError

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      showError('Please fix the validation errors')
      return
    }

    setIsSubmitting(true)

    try {
      await login(formData.email, formData.password)
      
      success('Login successful! Redirecting...')
      
      // Check for redirect URL from query params
      const redirectUrl = searchParams.get('redirect')
      
      if (redirectUrl) {
        router.push(redirectUrl)
      } else {
        router.push('/')
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-5">
        {/* Email */}
        <div>
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value })
              if (fieldErrors.email) {
                setFieldErrors({ ...fieldErrors, email: '' })
              }
            }}
            onBlur={() => {
              const error = validateEmail(formData.email)
              if (error) setFieldErrors({ ...fieldErrors, email: error })
            }}
            required
            autoComplete="email"
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            }
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-semantic-error">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-brand-blue hover:text-brand-navy transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value })
                if (fieldErrors.password) {
                  setFieldErrors({ ...fieldErrors, password: '' })
                }
              }}
              onBlur={() => {
                const error = validatePassword(formData.password)
                if (error) setFieldErrors({ ...fieldErrors, password: error })
              }}
              placeholder="••••••••"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue sm:text-sm transition-all"
            />
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-semantic-error">{fieldErrors.password}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-brand-navy bg-brand-gold hover:bg-[#FFD54F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold shadow-sm hover:shadow transition-all duration-200 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </div>
    </form>
  )
}
