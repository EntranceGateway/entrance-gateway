'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { FormInput } from '@/components/shared/Form/FormInput'
import { PasswordInput } from '@/components/shared/Form/PasswordInput'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [step, setStep] = useState<'request' | 'reset' | 'done'>('request')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (step === 'reset' && newPassword !== confirmNewPassword) {
      setError('Passwords do not match')
      return
    }
    setBusy(true)
    try {
      const response = await fetch(`/api/auth/password/${step}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(step === 'request' ? { email } : { email, otp, newPassword, confirmNewPassword }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Password reset failed')
      setStep(step === 'request' ? 'reset' : 'done')
      setOtp('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Please try again')
    } finally { setBusy(false) }
  }

  return (
    <main className="min-h-screen overflow-y-auto bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold text-brand-navy">Reset your password</h1>
        {step === 'done' ? <p role="status">Password reset successfully. Sign in with your new password.</p> : (
          <form onSubmit={submit} className="space-y-5">
            <p>{step === 'request' ? 'Enter your verified account email to receive a reset code.' : 'Enter the code from your email and choose a new password.'}</p>
            <FormInput id="email" label="Email Address" type="email" autoComplete="email" required value={email} disabled={step === 'reset' || busy} onChange={event => setEmail(event.target.value)} />
            {step === 'reset' && <>
              <FormInput id="otp" label="Reset code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" required value={otp} onChange={event => setOtp(event.target.value)} />
              <PasswordInput id="new-password" label="New password" autoComplete="new-password" minLength={8} required value={newPassword} onChange={event => setNewPassword(event.target.value)} />
              <PasswordInput id="confirm-password" label="Confirm password" autoComplete="new-password" minLength={8} required value={confirmNewPassword} onChange={event => setConfirmNewPassword(event.target.value)} />
            </>}
            {error && <p role="alert" className="text-red-700">{error}</p>}
            <button type="submit" disabled={busy} className="w-full rounded-lg bg-brand-navy p-3 font-bold text-white disabled:opacity-50">{busy ? 'Please wait...' : step === 'request' ? 'Send reset code' : 'Reset password'}</button>
            {step === 'reset' && <button type="button" disabled={busy} onClick={() => { setStep('request'); setError('') }} className="underline">Request another code</button>}
          </form>
        )}
        <Link className="mt-6 inline-block text-brand-blue underline" href="/signin">Back to sign in</Link>
      </div>
    </main>
  )
}
