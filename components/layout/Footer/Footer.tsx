import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-navy text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="mb-6">
              <Image 
                src="/eg-logo.jpg" 
                alt="EntranceGateway" 
                width={180} 
                height={50} 
                className="h-10 sm:h-12 w-auto" 
              />
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              EntranceGateway is Nepal's premier digital learning platform dedicated to helping students ace their entrance examinations with confidence and clarity.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/share/1Go6gjNUuc/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/entrance_gateway" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                </svg>
              </a>
              <a 
                href="https://youtube.com/@entrancegateway8834" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">Platform</h4>
            <ul className="space-y-3 sm:space-y-4 text-white/70 text-sm">
              <li>
                <Link href="/questions" className="hover:text-white transition-colors">
                  Old Questions
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/colleges" className="hover:text-white transition-colors">
                  Colleges
                </Link>
              </li>
              <li>
                <Link href="/trainings" className="hover:text-white transition-colors">
                  Training
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-white transition-colors">
                  Notes
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-white transition-colors">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">Support</h4>
            <ul className="space-y-3 sm:space-y-4 text-white/70 text-sm">
              <li>
                <Link href="/coming-soon" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/coming-soon" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/coming-soon" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/coming-soon" className="hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">Get in Touch</h4>
            <ul className="space-y-3 sm:space-y-4 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 mt-0.5 shrink-0 text-white/50">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>Sukedhara, Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 shrink-0 text-white/50">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <a href="tel:+9779701031808" className="hover:text-white transition-colors">
                  +977 9701031808
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 shrink-0 text-white/50">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <a href="tel:+9779844874516" className="hover:text-white transition-colors">
                  +977 9844874516
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 shrink-0 text-white/50">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <a href="mailto:info@entrancegateway.com" className="hover:text-white transition-colors">
                  info@entrancegateway.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 sm:mt-16 lg:mt-20 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-white/50 text-center sm:text-left">
              © {currentYear} Samasta Groups Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs sm:text-sm text-white/50">
              <Link href="/coming-soon" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <span className="text-white/30">|</span>
              <Link href="/coming-soon" className="hover:text-white transition-colors">
                Cookies
              </Link>
              <span className="text-white/30">|</span>
              <Link href="/coming-soon" className="hover:text-white transition-colors">
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
