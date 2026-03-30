export function SyllabusHeader() {
  return (
    <section className="mb-6 sm:mb-8">
      {/* SCRAPER: data-role="page-title" */}
      <h1 data-role="page-title" className="text-3xl md:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
        Course Syllabus Directory
      </h1>
      <p className="mt-2 text-gray-600 text-base sm:text-lg max-w-3xl">
        Browse courses by program and semester. Click to expand and view detailed subject information.
      </p>
    </section>
  )
}
