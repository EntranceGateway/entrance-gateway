import { cn } from '@/lib/utils/cn'
import Image from 'next/image'

interface CollegeDetailHeroProps {
  name: string
  location: string
  affiliation: string
  established: string
  coverImage: string
  logoText: string
  logoSrc?: string | null
  isFeatured?: boolean
  isVerified?: boolean
}

export function CollegeDetailHero({
  name,
  location,
  affiliation,
  established,
  coverImage,
  logoText,
  logoSrc,
  isFeatured = false,
  isVerified = false,
}: CollegeDetailHeroProps) {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      {/* Cover Image - object-cover ensures proper fit */}
      <img
        src={coverImage}
        alt={`${name} Campus Building`}
        className="w-full h-full object-cover"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/40 to-transparent"></div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          {/* Logo - hidden on mobile, shown on desktop */}
          <div className="bg-white p-2 rounded-xl shadow-lg flex-shrink-0 hidden md:block">
            <div className="w-24 h-24 bg-brand-navy text-white flex items-center justify-center rounded-lg font-bold text-2xl overflow-hidden">
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt={`${name} Logo`}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                logoText
              )}
            </div>
          </div>
          
          {/* College Info */}
          <div className="text-white flex-grow">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {isFeatured && (
                <span className="bg-brand-gold text-brand-navy px-2 py-0.5 rounded text-xs font-bold uppercase">
                  Featured Institute
                </span>
              )}
              {isVerified && (
                <span className="flex items-center gap-1 text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            
            {/* College Name */}
            <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight font-heading">
              {name}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base text-gray-200">
              <div className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-gold">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                {location}
              </div>
              <div className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-gold">
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                </svg>
                Affiliated to {affiliation}
              </div>
              <div className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-gold">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                </svg>
                Estd. {established}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
