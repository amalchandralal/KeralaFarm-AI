import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Home',       to: '/'         },
  { label: 'Dashboard',  to: '/dashboard' },
  { label: 'Voice AI',   to: '/voice'     },
  { label: 'Scan Crop',  to: '/scan'      },
  { label: 'Tracker',    to: '/tracker'   },
  { label: 'Offline',    to: '/offline'   },
  { label: 'Places',     to: '/places'    },
  { label: 'Bookings',   to: '/bookings'  },
]

const Navbar = () => {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full shadow-md bg-forest-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🌾</span>
            <span className="text-lg font-bold tracking-tight text-white">
              KeralaFarm <span className="text-yellow-400">AI</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="items-center hidden gap-1 md:flex">
            {navLinks.map(link => {
              const isActive = pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-yellow-400 text-forest-900 font-semibold'
                      : 'text-gray-200 hover:bg-forest-700 hover:text-white'
                    }
                  `}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Auth buttons */}
          <div className="items-center hidden gap-3 md:flex">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-200 hover:text-white transition-colors px-3 py-1.5"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold bg-yellow-400 hover:bg-yellow-300 text-forest-900 px-4 py-1.5 rounded-md transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="p-2 text-gray-200 rounded-md md:hidden hover:bg-forest-700"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="px-4 py-3 space-y-1 border-t md:hidden bg-forest-800 border-forest-700">
          {navLinks.map(link => {
            const isActive = pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`
                  block px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-yellow-400 text-forest-900 font-semibold'
                    : 'text-gray-200 hover:bg-forest-700 hover:text-white'
                  }
                `}
              >
                {link.label}
              </Link>
            )
          })}
          <div className="flex flex-col gap-2 pt-2 border-t border-forest-700">
            <Link to="/login"    onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-200 hover:text-white">Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-center bg-yellow-400 rounded-md text-forest-900">Register</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar