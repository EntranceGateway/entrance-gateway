'use client'

import { useState, useEffect } from 'react'

export function HomeWhyChoose() {
  const features = [
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      emoji: '📘',
      title: 'Well-Structured Notes',
      description:
        'Get clear and simple notes that make studying easier. No fluff—just what you need to understand topics quickly and revise without stress.',
      tags: 'Easy to understand • Perfect for quick revision',
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      emoji: '📄',
      title: 'Previous Year Questions',
      description:
        'Practice with actual questions from past exams. See what topics come up most and get familiar with how questions are asked.',
      tags: 'Spot patterns • Focus on what matters',
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      emoji: '📚',
      title: 'Complete Syllabus',
      description:
        "Know exactly what to study and when. Our syllabus keeps you organized so you don't miss anything important.",
      tags: 'Stay on track • Cover everything',
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      emoji: '🎓',
      title: 'Guided Training',
      description:
        'Learn step-by-step with programs that build your basics and sharpen your problem-solving skills.',
      tags: 'Build strong foundations • Get better at solving problems',
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      emoji: '📝',
      title: 'Mock Tests',
      description:
        "Take practice tests that feel like the real thing. Find out where you stand and learn to manage your time better.",
      tags: "See how you're doing • Practice under pressure",
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      emoji: '🏛️',
      title: 'College Recommendations',
      description:
        'Not sure which college is right for you? Get personalized suggestions based on your scores, interests, and career goals.',
      tags: 'Find your fit • Make informed choices',
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, features.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length)
    setIsAutoPlaying(false)
  }

  // Calculate position for each card in coverflow
  const getCardStyle = (index: number) => {
    const diff = index - currentIndex
    const absDistance = Math.abs(diff)

    // Center card
    if (diff === 0) {
      return {
        transform: 'translateX(0%) scale(1) rotateY(0deg)',
        opacity: 1,
        zIndex: 30,
      }
    }

    // Left cards
    if (diff < 0) {
      return {
        transform: `translateX(${diff * 85}%) scale(${1 - absDistance * 0.15}) rotateY(25deg)`,
        opacity: absDistance === 1 ? 0.6 : 0.3,
        zIndex: 30 - absDistance,
      }
    }

    // Right cards
    return {
      transform: `translateX(${diff * 85}%) scale(${1 - absDistance * 0.15}) rotateY(-25deg)`,
      opacity: absDistance === 1 ? 0.6 : 0.3,
      zIndex: 30 - absDistance,
    }
  }

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mb-4 font-heading">
            Why choose EntranceGateway?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            We provide the most comprehensive resources designed for academic authority and student
            success.
          </p>
        </div>

        {/* Coverflow Carousel */}
        <div className="relative h-[450px] sm:h-[500px] md:h-[550px]">
          {/* Cards Container */}
          <div className="relative h-full flex items-center justify-center" style={{ perspective: '2000px' }}>
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="absolute w-full max-w-[280px] sm:max-w-sm md:max-w-md transition-all duration-700 ease-out cursor-pointer"
                style={getCardStyle(index)}
                onClick={() => goToSlide(index)}
              >
                <div className="relative p-6 sm:p-8 bg-white rounded-3xl shadow-2xl h-full">
                  {/* Icon */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-gold rounded-2xl flex items-center justify-center mb-3 sm:mb-4 text-brand-navy">
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-navy mb-2 sm:mb-3">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-2 sm:mb-3 leading-relaxed text-sm sm:text-base">{feature.description}</p>

                  {/* Tags */}
                  <p className="text-brand-blue text-xs sm:text-sm font-medium">{feature.tags}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-navy hover:bg-brand-gold transition-colors z-40"
            aria-label="Previous slide"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-navy hover:bg-brand-gold transition-colors z-40"
            aria-label="Next slide"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8 sm:mt-12">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-6 sm:w-8 bg-brand-gold' : 'w-2 bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
