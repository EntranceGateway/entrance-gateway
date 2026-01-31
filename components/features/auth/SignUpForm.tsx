'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormInput } from '@/components/shared/Form/FormInput'
import { FormSelect } from '@/components/shared/Form/FormSelect'
import { PasswordInput } from '@/components/shared/Form/PasswordInput'
import { PasswordStrength } from '@/components/shared/Form/PasswordStrength'
import { Checkbox } from '@/components/shared/Form/Checkbox'
import { Spinner } from '@/components/shared/Loading'
import { register, storePendingEmail } from '@/lib/auth/client'
import { useToast } from '@/components/shared/Toast'

export function SignUpForm() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    course: '',
    latestQualification: '',
    password: '',
    terms: false,
  })

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasLength: false,
    hasNumber: false,
    hasSpecial: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Validation functions
  const validateFullName = (value: string): string => {
    if (!value.trim()) return 'Full name is required'
    return ''
  }

  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Email should be valid'
    return ''
  }

  const validateContact = (value: string): string => {
    if (!value.trim()) return 'Contact number is required'
    const contactRegex = /^(\+977|977)?(97|98|96)[0-9]{8}$/
    if (!contactRegex.test(value)) {
      return 'Contact must be a valid mobile number with optional country code (+977 or 977)'
    }
    return ''
  }

  const validateAddress = (value: string): string => {
    if (!value.trim()) return 'Address is required'
    return ''
  }

  const validateDob = (value: string): string => {
    if (!value) return 'Date of birth is required'
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
    
    const fullNameError = validateFullName(formData.fullName)
    if (fullNameError) errors.fullName = fullNameError

    const emailError = validateEmail(formData.email)
    if (emailError) errors.email = emailError

    const contactError = validateContact(formData.phoneNumber)
    if (contactError) errors.phoneNumber = contactError

    const addressError = validateAddress(formData.address)
    if (addressError) errors.address = addressError

    const dobError = validateDob(formData.dateOfBirth)
    if (dobError) errors.dateOfBirth = dobError

    const passwordError = validatePassword(formData.password)
    if (passwordError) errors.password = passwordError

    if (!formData.terms) {
      errors.terms = 'Please accept the terms and conditions'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      showError('Please fix the validation errors')
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        fullname: formData.fullName,
        email: formData.email,
        contact: formData.phoneNumber,
        address: formData.address,
        dob: formData.dateOfBirth,
        interested: formData.course,
        latestQualification: formData.latestQualification,
        password: formData.password,
      })
      
      // Store email in sessionStorage for OTP verification
      storePendingEmail(formData.email)
      
      success('Registration successful! Please verify your email with the OTP sent.')
      
      // Navigate to OTP verification page
      router.push('/verify-otp')
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, password: value })
    
    // Calculate password strength (minimum 8 characters)
    const hasLength = value.length >= 8
    const hasNumber = /\d/.test(value)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value)
    
    let score = 0
    if (hasLength) score++
    if (hasNumber) score++
    if (hasSpecial) score++
    if (value.length >= 12) score++
    
    setPasswordStrength({ score, hasLength, hasNumber, hasSpecial })
  }

  const courseOptions = [
    { value: '', label: 'Select your preparation path' },
    { value: 'ioe', label: 'BE Entrance (IOE)' },
    { value: 'iom', label: 'MBBS/BDS Entrance (IOM/CEE)' },
    { value: 'cmat', label: 'BBA/BIM (CMAT)' },
    { value: 'ku', label: 'KUUMAT (Kathmandu University)' },
    { value: 'neb', label: 'Class 11 & 12 Science Support' },
  ]

  const qualificationOptions = [
    { value: '', label: 'Select your latest qualification' },
    { value: 'class10', label: 'Class 10 / SEE' },
    { value: 'class11', label: 'Class 11' },
    { value: 'class12', label: 'Class 12 / +2' },
    { value: 'bachelor', label: 'Bachelor\'s Degree' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full Name */}
      <div>
        <FormInput
          id="full-name"
          name="full-name"
          type="text"
          label="Full Name"
          placeholder="e.g. Aarav Sharma"
          value={formData.fullName}
          onChange={(e) => {
            setFormData({ ...formData, fullName: e.target.value })
            if (fieldErrors.fullName) {
              setFieldErrors({ ...fieldErrors, fullName: '' })
            }
          }}
          onBlur={() => {
            const error = validateFullName(formData.fullName)
            if (error) setFieldErrors({ ...fieldErrors, fullName: error })
          }}
          required
          autoComplete="name"
        />
        {fieldErrors.fullName && (
          <p className="mt-1 text-xs text-semantic-error">{fieldErrors.fullName}</p>
        )}
      </div>

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
          validationIcon={
            formData.email && !validateEmail(formData.email) ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-success">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            ) : undefined
          }
          isValid={!!(formData.email && !validateEmail(formData.email))}
        />
        {fieldErrors.email && (
          <p className="mt-1 text-xs text-semantic-error">{fieldErrors.email}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <FormInput
          id="phone-number"
          name="phone-number"
          type="tel"
          label="Phone Number"
          placeholder="e.g. 9841234567 or +9779841234567"
          value={formData.phoneNumber}
          onChange={(e) => {
            setFormData({ ...formData, phoneNumber: e.target.value })
            if (fieldErrors.phoneNumber) {
              setFieldErrors({ ...fieldErrors, phoneNumber: '' })
            }
          }}
          onBlur={() => {
            const error = validateContact(formData.phoneNumber)
            if (error) setFieldErrors({ ...fieldErrors, phoneNumber: error })
          }}
          required
          autoComplete="tel"
        />
        {fieldErrors.phoneNumber && (
          <p className="mt-1 text-xs text-semantic-error">{fieldErrors.phoneNumber}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <FormInput
          id="address"
          name="address"
          type="text"
          label="Address"
          placeholder="e.g. Kathmandu, Nepal"
          value={formData.address}
          onChange={(e) => {
            setFormData({ ...formData, address: e.target.value })
            if (fieldErrors.address) {
              setFieldErrors({ ...fieldErrors, address: '' })
            }
          }}
          onBlur={() => {
            const error = validateAddress(formData.address)
            if (error) setFieldErrors({ ...fieldErrors, address: error })
          }}
          required
          autoComplete="street-address"
        />
        {fieldErrors.address && (
          <p className="mt-1 text-xs text-semantic-error">{fieldErrors.address}</p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <FormInput
          id="date-of-birth"
          name="date-of-birth"
          type="date"
          label="Date of Birth"
          value={formData.dateOfBirth}
          onChange={(e) => {
            setFormData({ ...formData, dateOfBirth: e.target.value })
            if (fieldErrors.dateOfBirth) {
              setFieldErrors({ ...fieldErrors, dateOfBirth: '' })
            }
          }}
          onBlur={() => {
            const error = validateDob(formData.dateOfBirth)
            if (error) setFieldErrors({ ...fieldErrors, dateOfBirth: error })
          }}
          required
          autoComplete="bday"
        />
        {fieldErrors.dateOfBirth && (
          <p className="mt-1 text-xs text-semantic-error">{fieldErrors.dateOfBirth}</p>
        )}
      </div>

      {/* Course Selection */}
      <FormSelect
        id="course"
        name="course"
        label="Desired Course"
        value={formData.course}
        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
        options={courseOptions}
        required
      />

      {/* Latest Qualification */}
      <FormSelect
        id="latest-qualification"
        name="latest-qualification"
        label="Latest Qualification"
        value={formData.latestQualification}
        onChange={(e) => setFormData({ ...formData, latestQualification: e.target.value })}
        options={qualificationOptions}
        required
      />

      {/* Password */}
      <div className="space-y-1">
        <PasswordInput
          id="password"
          name="password"
          label="Password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => {
            handlePasswordChange(e.target.value)
            if (fieldErrors.password) {
              setFieldErrors({ ...fieldErrors, password: '' })
            }
          }}
          onBlur={() => {
            const error = validatePassword(formData.password)
            if (error) setFieldErrors({ ...fieldErrors, password: error })
          }}
          required
        />
        {fieldErrors.password && (
          <p className="mt-1 text-xs text-semantic-error">{fieldErrors.password}</p>
        )}
        
        {/* Password Strength Indicator */}
        {formData.password && !fieldErrors.password && (
          <PasswordStrength
            score={passwordStrength.score}
            hasLength={passwordStrength.hasLength}
            hasNumber={passwordStrength.hasNumber}
            hasSpecial={passwordStrength.hasSpecial}
          />
        )}
      </div>

      {/* Terms and Conditions */}
      <div>
        <Checkbox
          id="terms"
          name="terms"
          checked={formData.terms}
          onChange={(e) => {
            setFormData({ ...formData, terms: e.target.checked })
            if (fieldErrors.terms) {
              setFieldErrors({ ...fieldErrors, terms: '' })
            }
          }}
          required
          label={
            <>
              I agree to the{' '}
              <a
                href="/terms"
                className="text-brand-blue hover:text-brand-navy underline decoration-1 underline-offset-2"
              >
                Terms and Conditions
              </a>{' '}
              and Privacy Policy.
            </>
          }
        />
        {fieldErrors.terms && (
          <p className="mt-1 text-xs text-semantic-error">{fieldErrors.terms}</p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-brand-navy bg-brand-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold transition-colors transform active:scale-[0.99] duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </div>
    </form>
  )
}
