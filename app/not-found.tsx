import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found | EntranceGateway',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <main className="flex-grow flex items-center justify-center py-12 sm:py-20 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icon Section */}
        <div className="mb-8 sm:mb-12 relative inline-block">
          <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto bg-blue-50 rounded-full flex items-center justify-center relative">
            {/* Background decorative icon - explore/compass */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-brand-blue opacity-20 absolute size-32 sm:size-40"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
            </svg>
            
            {/* Main menu_book icon - open book */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-brand-navy relative z-10 size-28 sm:size-36"
            >
              <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
            </svg>
          </div>
          
          {/* Search off badge */}
          <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-brand-gold p-3 sm:p-4 rounded-2xl shadow-lg">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-brand-navy size-8 sm:size-10"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              <path d="M7 9h5v1H7z" />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-navy tracking-tight mb-3 sm:mb-4 font-heading">
          404 - Page Not Found
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-lg mx-auto leading-relaxed px-4">
          It looks like the resource you are looking for has been moved or doesn't exist. Let's get you back on the right path.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-brand-gold hover:bg-[#ffca28] text-brand-navy font-bold rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Back to Home
          </Link>
          
          <Link
            href="/courses"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-white border-2 border-brand-blue text-brand-blue hover:bg-blue-50 font-bold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
            </svg>
            Browse Courses
          </Link>
        </div>

        {/* Common Destinations */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200">
          <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">
            Common Destinations
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-8 gap-y-2 px-4">
            <Link
              href="/syllabus"
              className="text-gray-500 hover:text-brand-navy text-xs sm:text-sm font-medium transition-colors"
            >
              Syllabus
            </Link>
            <Link
              href="/notes"
              className="text-gray-500 hover:text-brand-navy text-xs sm:text-sm font-medium transition-colors"
            >
              Notes
            </Link>
            <Link
              href="/questions"
              className="text-gray-500 hover:text-brand-navy text-xs sm:text-sm font-medium transition-colors"
            >
              Past Questions
            </Link>
            <Link
              href="/trainings"
              className="text-gray-500 hover:text-brand-navy text-xs sm:text-sm font-medium transition-colors"
            >
              Trainings
            </Link>
            <Link
              href="/blogs"
              className="text-gray-500 hover:text-brand-navy text-xs sm:text-sm font-medium transition-colors"
            >
              Blogs
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
