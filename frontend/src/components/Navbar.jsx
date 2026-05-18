import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { to: "/dashboard", label: "History" },
    { to: "/upload", label: "Convert" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm"
          : "bg-white/75 backdrop-blur-xl"
      } border-b border-black border-opacity-5`}
    >
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-14">
          {/* Wordmark — left */}
          <Link to="/" className="shrink-0 flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-base font-semibold text-primary tracking-tight">
              FlipDoc
            </span>
          </Link>

          {/* Center links — desktop */}
          <div className="hidden sm:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  isActive(to)
                    ? "text-primary bg-black bg-opacity-5"
                    : "text-light-gray hover:text-primary"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right — Ask AI teaser */}
          <div className="hidden sm:flex items-center shrink-0">
            <div className="relative group">
              <button
                disabled
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium text-light-gray border border-black border-opacity-10 cursor-not-allowed select-none"
              >
                <span className="text-xs">✦</span>
                Ask AI
              </button>
              {/* Tooltip */}
              <div className="absolute right-0 top-full mt-2 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                In progress — coming soon
                <div className="absolute -top-1 right-4 w-2 h-2 bg-primary rotate-45" />
              </div>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="sm:hidden p-2 flex flex-col gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-primary transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-primary transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-primary transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white/95 backdrop-blur-xl border-t border-black border-opacity-5 px-6 py-5 flex flex-col gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-primary py-2.5 px-3 rounded-xl hover:bg-bg-light transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 mt-1 border-t border-black border-opacity-5">
            <Link
              to="/upload"
              onClick={() => setMenuOpen(false)}
              className="block px-5 py-3 bg-primary text-white rounded-full text-center text-sm font-medium hover:bg-dark-gray transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
