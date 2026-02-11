interface CollegeAboutProps {
  description: string
}

export function CollegeAbout({ description }: CollegeAboutProps) {
  return (
    <section className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-200">
      <h2 className="text-xl sm:text-2xl font-bold text-brand-navy mb-3 sm:mb-4 flex items-center gap-2 font-heading">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 sm:size-6">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
        About the College
      </h2>
      <div className="prose max-w-none text-gray-600">
        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line">{description}</p>
      </div>
    </section>
  )
}
