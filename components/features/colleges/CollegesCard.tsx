import Link from 'next/link'
import { useResourceImage } from '@/hooks/api/useResourceImage'
import type { College } from '@/types/colleges.types'

interface CollegesCardProps {
  item: College
  onFavorite?: (id: number) => void
}

export function CollegesCard({ item, onFavorite }: CollegesCardProps) {
  // Fetch logo image using resource hook
  const { src: logoSrc, isLoading: isLogoLoading } = useResourceImage(item.logoName || null, {
    enabled: !!item.logoName,
  })

  // Get first college picture if available
  const firstPicture = item.collegePictureName?.[0] || null
  const { src: pictureSrc, isLoading: isPictureLoading } = useResourceImage(firstPicture, {
    enabled: !!firstPicture,
  })

  // Use picture if available, otherwise use logo
  const displayImage = pictureSrc || logoSrc
  const isImageLoading = isPictureLoading || isLogoLoading

  // Get first course category or default
  const category = item.courses?.[0]?.courseName || 'Higher Education'

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200 transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <Link href={`/colleges/${item.collegeId}`} className="relative h-48 overflow-hidden block">
        {isImageLoading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : displayImage ? (
          <img
            src={displayImage}
            alt={item.collegeName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-navy to-brand-blue flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-16 text-white/30">
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
            </svg>
          </div>
        )}
        {/* Affiliation Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-brand-blue shadow-sm flex items-center gap-1">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
          </svg>
          {item.affiliation.replace(/_/g, ' ')}
        </div>
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Category */}
        <div className="mb-1 text-xs font-bold text-brand-blue uppercase tracking-wide">
          {category}
        </div>

        {/* College Name */}
        <Link href={`/colleges/${item.collegeId}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-brand-blue transition-colors cursor-pointer line-clamp-2">
            {item.collegeName}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-gray-400">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span>{item.location}</span>
        </div>

        {/* Courses Count */}
        {item.courses && item.courses.length > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-4">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 text-gray-400">
              <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
            </svg>
            <span>{item.courses.length} {item.courses.length === 1 ? 'Course' : 'Courses'}</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <Link
            href={`/colleges/${item.collegeId}`}
            className="flex-1 bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-2.5 px-4 rounded-lg transition-colors text-sm text-center"
          >
            View Details
          </Link>
          <button
            onClick={() => onFavorite?.(item.collegeId)}
            className="p-2.5 border-2 border-gray-200 hover:border-brand-gold hover:bg-brand-gold/10 rounded-lg transition-colors"
            aria-label="Add to favorites"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 text-gray-600">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Card Grid Container
export function CollegesCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {children}
    </div>
  )
}
