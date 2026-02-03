'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useToast } from '@/components/shared/Toast'
import { Spinner } from '@/components/shared/Loading'

export function ComingSoonContent() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { success, error } = useToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      error('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      success('Thank you! We\'ll notify you when we launch.')
      setEmail('')
    } catch (err) {
      error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative flex-grow flex flex-col items-center justify-center px-4 py-12 sm:py-16 text-center">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-gray-50 -z-10">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(#1A237E 0.5px, transparent 0.5px)`,
            backgroundSize: '24px 24px',
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgb(249 250 251) 100%)',
          }}
        />
      </div>

      {/* Logo Section */}
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-navy rounded-2xl flex items-center justify-center shadow-xl shadow-brand-navy/20">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-brand-gold size-10 sm:size-12">
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl sm:text-3xl tracking-tight text-brand-navy font-heading">
              EntranceGateway
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-brand-blue/70">
              Nepal's Premier Prep Platform
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mb-8 sm:mb-12 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-brand-navy tracking-tight leading-tight mb-4 sm:mb-6 font-heading">
          Something Great is{' '}
          <span className="text-brand-blue">Learning</span>{' '}
          to Launch
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
          We're building the ultimate digital gateway for entrance exam excellence in Nepal. 
          The wait is almost over for the next generation of scholars.
        </p>
      </div>

      {/* Progress Timeline */}
      <div className="w-full max-w-3xl mb-12 sm:mb-16 px-4">
        <div className="relative flex items-center justify-between mb-4">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 rounded-full overflow-hidden bg-gray-200">
            <div className="h-full bg-brand-gold w-2/3" />
          </div>

          {/* Milestone 1 - Completed */}
          <div className="relative flex flex-col items-center z-10">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-gold flex items-center justify-center border-4 border-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="text-brand-navy size-3.5 sm:size-4">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <span className="absolute top-10 sm:top-12 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider text-brand-navy whitespace-nowrap">
              Curriculum Design
            </span>
          </div>

          {/* Milestone 2 - In Progress */}
          <div className="relative flex flex-col items-center z-10">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-gold flex items-center justify-center border-4 border-white shadow-sm ring-4 ring-brand-gold/20">
              <svg viewBox="0 0 24 24" fill="currentColor" className="text-brand-navy size-3.5 sm:size-4 animate-pulse">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
              </svg>
            </div>
            <span className="absolute top-10 sm:top-12 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider text-brand-navy whitespace-nowrap">
              Platform Testing
            </span>
          </div>

          {/* Milestone 3 - Upcoming */}
          <div className="relative flex flex-col items-center z-10">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 size-3.5 sm:size-4">
                <path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55l1.33.89M11.17 17s3.74-1.55 5.89-3.7c5.4-5.4 4.5-9.62 4.21-10.57-.95-.3-5.17-1.19-10.57 4.21C8.55 9.09 7 12.83 7 12.83l1.39 1.39 1.39 1.39 1.39 1.39m9.58-7.27c-.19-.19-.58-.19-.77 0l-1.63 1.63c-.19.19-.19.58 0 .77.19.19.58.19.77 0l1.63-1.63c.19-.19.19-.58 0-.77M6 20l2-2-1.41-1.41L5 18.17 3.41 16.59 2 18l1.59 1.59L2 21.17 3.41 22.58 5 21l1.59 1.59L8 21l-1.59-1.59L8 18z" />
              </svg>
            </div>
            <span className="absolute top-10 sm:top-12 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
              Official Launch
            </span>
          </div>
        </div>
      </div>

      {/* Email Subscription Form */}
      <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl shadow-brand-navy/5 border border-gray-100">
        <label 
          htmlFor="email" 
          className="block text-xs sm:text-sm font-bold text-brand-navy mb-3 sm:mb-4 uppercase tracking-widest"
        >
          Be first to know when we're live
        </label>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-grow relative">
            <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={isSubmitting}
              className="w-full rounded-xl border-gray-200 pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base text-gray-700 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold shadow-inner transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-brand-gold hover:bg-[#FBC02D] text-brand-navy font-black px-6 sm:px-10 py-3 sm:py-4 rounded-xl transition-all shadow-[0_4px_0_0_#D4A017] hover:shadow-[0_2px_0_0_#D4A017] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none whitespace-nowrap text-xs sm:text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_0_0_#D4A017] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" />
                <span className="hidden sm:inline">Submitting...</span>
              </>
            ) : (
              'Notify Me'
            )}
          </button>
        </form>
        
        <p className="mt-3 sm:mt-4 text-xs text-gray-400 flex items-center justify-center gap-1">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
          </svg>
          Zero spam. Just academic excellence updates.
        </p>
      </div>

      {/* Social Links */}
      <div className="mt-12 sm:mt-16">
        <div className="flex items-center space-x-6 sm:space-x-10">
          <Link
            href="#"
            aria-label="Facebook"
            className="text-gray-400 hover:text-brand-navy transition-all hover:scale-110"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </Link>
          
          <Link
            href="#"
            aria-label="LinkedIn"
            className="text-gray-400 hover:text-brand-navy transition-all hover:scale-110"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
            </svg>
          </Link>
          
          <Link
            href="#"
            aria-label="Instagram"
            className="text-gray-400 hover:text-brand-navy transition-all hover:scale-110"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.848 0-3.204.012-3.584.07-4.849.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </Link>
        </div>
        
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">
            © 2024 EntranceGateway Nepal
          </p>
          <p className="text-[10px] text-gray-400 font-medium">
            Empowering Nepal's Students Through Excellence
          </p>
        </div>
      </div>
    </main>
  )
}
