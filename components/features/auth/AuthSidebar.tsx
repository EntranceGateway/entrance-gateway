export function AuthSidebar() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-brand-navy flex-col justify-between overflow-hidden h-screen">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          alt="University Campus"
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          src="/classroom.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/80 to-brand-navy/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-12 flex flex-col h-full justify-between text-white">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-8 text-brand-gold">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
          </svg>
          <span className="font-bold text-xl tracking-tight font-heading">EntranceGateway</span>
        </div>

        {/* Main Content */}
        <div className="max-w-md mb-12">
          <h2 className="text-4xl font-bold font-heading leading-tight mb-6">
            Your journey to <br />
            <span className="text-brand-gold">academic excellence</span>
            <br />
            starts here.
          </h2>
          <p className="text-lg text-gray-200 leading-relaxed font-light">
            Join over 50,000 students across Nepal preparing for their Engineering, Medical, and
            Management entrance exams with our adaptive learning platform.
          </p>

          {/* Features */}
          <div className="mt-8 flex gap-4 items-center text-sm text-gray-300 font-medium flex-wrap">
            <div className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-gold">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>Live Classes</span>
            </div>
            <div className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-gold">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>Mock Tests</span>
            </div>
            <div className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-gold">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>Expert Mentors</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-400">© 2024 EntranceGateway Education Pvt Ltd.</div>
      </div>
    </div>
  )
}
