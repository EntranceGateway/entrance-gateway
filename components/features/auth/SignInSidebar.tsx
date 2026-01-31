export function SignInSidebar() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-brand-navy flex-col justify-between p-12 xl:p-16 overflow-hidden h-screen">
      {/* Decorative Background Icons */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Large School Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-white/[0.03] absolute -right-20 -top-20 transform rotate-12"
          style={{ width: '400px', height: '400px' }}
        >
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
        </svg>

        {/* Book Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-white/[0.03] absolute -left-10 bottom-0 transform -rotate-12"
          style={{ width: '300px', height: '300px' }}
        >
          <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
        </svg>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/50 to-black/20 mix-blend-multiply" />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-8 text-brand-gold">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
          </svg>
        </div>
        <span className="font-heading font-bold text-2xl tracking-tight text-white">
          EntranceGateway
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-lg mt-auto mb-auto">
        <h1 className="font-heading text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
          Continue your journey to academic excellence.
        </h1>
        <p className="text-indigo-100/90 text-lg leading-relaxed font-light">
          Unlock thousands of practice questions, expert-curated study materials, and mock exams
          designed for the top entrance tests in Nepal.
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <div className="flex items-center gap-6 text-indigo-200/60 text-sm font-medium flex-wrap">
          <span>© 2024 EntranceGateway</span>
          <span className="w-1 h-1 bg-indigo-200/40 rounded-full" />
          <span>Privacy Policy</span>
          <span className="w-1 h-1 bg-indigo-200/40 rounded-full" />
          <span>Terms of Service</span>
        </div>
      </div>
    </div>
  )
}
