interface ContactInfo {
  website?: string
  phone?: string
  email?: string
}

interface CollegeContactMobileProps {
  contactInfo: ContactInfo
  latitude?: number
  longitude?: number
  collegeName?: string
}

export function CollegeContactMobile({ contactInfo, latitude, longitude, collegeName }: CollegeContactMobileProps) {
  // Generate Google Maps URL
  const mapUrl = latitude && longitude 
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : null

  return (
    <>
      <section className="lg:hidden bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-base sm:text-lg font-bold text-brand-navy mb-3 sm:mb-4">Contact Information</h3>
        <div className="space-y-3 sm:space-y-4 text-sm">
          {contactInfo.website && (
            <a
              href={contactInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-3 text-gray-600 hover:text-brand-blue transition-colors break-all"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue shrink-0">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 sm:size-4">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
                </svg>
              </div>
              <span className="font-medium text-xs sm:text-sm">{contactInfo.website}</span>
            </a>
          )}
          {contactInfo.phone && (
            <a
              href={`tel:${contactInfo.phone}`}
              className="flex items-center gap-2 sm:gap-3 text-gray-600 hover:text-brand-blue transition-colors"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue shrink-0">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 sm:size-4">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </div>
              <span className="font-medium text-xs sm:text-sm">{contactInfo.phone}</span>
            </a>
          )}
          {contactInfo.email && (
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-2 sm:gap-3 text-gray-600 hover:text-brand-blue transition-colors break-all"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue shrink-0">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5 sm:size-4">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <span className="font-medium text-xs sm:text-sm">{contactInfo.email}</span>
            </a>
          )}
        </div>
      </section>

      {/* Location Map - Mobile */}
      {mapUrl && (
        <section className="lg:hidden bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <h3 className="text-base sm:text-lg font-bold text-brand-navy mb-3 sm:mb-4 flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5 text-brand-gold">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Location
          </h3>
          
          {/* Map Preview */}
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg overflow-hidden h-48 sm:h-56 bg-gray-200 relative group cursor-pointer mb-3 sm:mb-4"
          >
            <iframe
              src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
              title={`Map of ${collegeName || 'College Location'}`}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
          </a>

          {/* Coordinates */}
          <div className="space-y-2 text-xs text-gray-500 mb-3 sm:mb-4">
            <div className="flex items-center justify-between">
              <span>Latitude:</span>
              <span className="font-mono font-medium text-gray-700">{latitude}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Longitude:</span>
              <span className="font-mono font-medium text-gray-700">{longitude}</span>
            </div>
          </div>

          {/* View on Google Maps Button */}
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-brand-blue hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            View on Google Maps
          </a>
        </section>
      )}
    </>
  )
}
