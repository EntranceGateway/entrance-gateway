'use client'

import { useState, useEffect } from 'react'

export function HomeTestimonials() {
  const testimonials = [
    {
      name: 'Rakesh Shrestha',
      role: 'Engineering Student',
      image: '/rakesh.jpg',
      quote:
        'The notes here are so clear and easy to understand. I used them to revise everything before my exams and scored way better than I expected. Saved me so much time compared to reading thick textbooks. Highly recommend for quick revision!',
    },
    {
      name: 'Hemraj Roka',
      role: 'Management Student',
      image: '/hemraj.jpg',
      quote:
        'Old question papers were a game changer for me. I could see exactly what kind of questions appear in exams and which topics are most important. Practiced 5 years of past papers and felt super confident during my actual exam.',
    },
    {
      name: 'Gokarna Chaudhary',
      role: 'Science Student',
      image: '/gokarna.jpg',
      quote:
        "The complete syllabus helped me stay organized throughout the semester. I always knew what to study next and never felt lost or confused. It's like having a clear plan from day one. Perfect for students who want to stay on track.",
    },
    {
      name: 'JN Bhandari',
      role: 'Commerce Student',
      image: '/jn.jpg',
      quote:
        'I was really struggling with some subjects, but the training programs here explained everything step by step. The concepts finally made sense! My grades improved a lot and I actually started enjoying studying again.',
    },
    {
      name: 'Aankami Ghale',
      role: 'Law Student',
      image: '/ghale.jpg',
      quote:
        'Mock tests helped me practice before the real exam. I learned how to manage my time better and got used to the exam pressure. By the time my actual exam came, I felt prepared and calm. The analysis feature also showed me where I needed to improve.',
    },
    {
      name: 'Rohan Shrestha',
      role: 'TU Student',
      image: '/profile.jpg',
      quote:
        "This platform has everything I need as a TU student—notes, old questions, syllabus, training, and tests. I don't have to look anywhere else. My grades went up from average to above average in just one semester. Totally worth it!",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
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
    <section className="py-24 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-heading">
            Success Stories from Learners
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
            Hear from students who transformed their academic journey with EntranceGateway
          </p>
        </div>

        {/* Coverflow Carousel */}
        <div className="relative h-[500px] sm:h-[550px] md:h-[600px]">
          {/* Cards Container */}
          <div
            className="relative h-full flex items-center justify-center"
            style={{ perspective: '2000px' }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="absolute w-full max-w-[280px] sm:max-w-sm md:max-w-md transition-all duration-700 ease-out cursor-pointer"
                style={getCardStyle(index)}
                onClick={() => goToSlide(index)}
              >
                <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 pt-8 sm:pt-10 relative flex flex-col h-full shadow-2xl">
                  {/* Profile Image */}
                  <div className="absolute -top-10 sm:-top-12 -right-2">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                      <img
                        alt={`Student ${testimonial.name}`}
                        className="w-full h-full object-cover"
                        src={testimonial.image}
                      />
                    </div>
                  </div>

                  {/* Quote Icon */}
                  <div className="text-gray-200 mb-4 sm:mb-6">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 sm:w-20 sm:h-20">
                      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                    </svg>
                  </div>

                  {/* Star Rating */}
                  <div className="flex gap-1 mb-3 sm:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 flex-grow">
                    "{testimonial.quote}"
                  </p>

                  {/* Student Info */}
                  <div>
                    <h4 className="text-brand-navy text-base sm:text-lg font-bold">{testimonial.name}</h4>
                    <p className="text-gray-500 text-xs sm:text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-navy hover:bg-brand-gold transition-colors z-40"
            aria-label="Previous testimonial"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-navy hover:bg-brand-gold transition-colors z-40"
            aria-label="Next testimonial"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8 sm:mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-6 sm:w-8 bg-brand-gold' : 'w-2 bg-gray-300'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
