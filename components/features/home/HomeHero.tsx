'use client'

export function HomeHero() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16 lg:mb-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-brand-navy tracking-tight mb-4 md:mb-6 lg:mb-8 leading-tight font-heading px-2">
            Master Your Future with{' '}
            <span className="text-brand-blue">Academic Excellence</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 lg:mb-10 leading-relaxed px-4 sm:px-6 md:px-8 font-sans">
            Join thousands of students preparing for Nepal's toughest entrance exams with expert
            guidance, premium study materials, and real-time mock tests.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
            <button className="bg-brand-gold text-brand-navy px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold text-base md:text-lg hover:shadow-lg transition-all w-full sm:w-auto">
              Explore Courses
            </button>
            <button className="border-2 border-brand-blue text-brand-blue px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-brand-blue hover:text-white transition-all w-full sm:w-auto">
              View Mock Tests
            </button>
          </div>
        </div>

        {/* YouTube Video */}
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-black shadow-xl md:shadow-2xl">
            <div className="aspect-video relative">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/RWH7qeY726k?enablejsapi=1&rel=0&modestbranding=1"
                title="EntranceGateway Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Pause Button Overlay - Bottom Right */}
            {/* <button
              className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: '#7B2CBF' }}
              aria-label="Pause video"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 md:size-6 text-white">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            </button> */}
          </div>
        </div>
      </div>
    </section>
  )
}
// testing