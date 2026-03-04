import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

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
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const [menuOpen, setMenuOpen]       = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/logout', { method: 'POST', credentials: 'include' })
    } catch (_) {}
    setUser(null)
    setDropdownOpen(false)
    navigate('/')
  }

  // Get initials from name
  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

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

          {/* Auth section */}
          <div className="items-center hidden gap-3 md:flex">
            {user ? (
              // ── Logged in: avatar + dropdown ──────────────────────────
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 px-2 py-1 transition-colors rounded-lg hover:bg-forest-700"
                >
                  {/* Avatar circle with initials */}
                  <div className="flex items-center justify-center w-8 h-8 text-sm font-bold bg-yellow-400 rounded-full text-forest-900">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-gray-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 z-50 w-48 mt-2 overflow-hidden bg-white border border-gray-100 shadow-lg rounded-xl">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-forest-50">
                      <p className="text-sm font-semibold truncate text-forest-800">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    {/* Menu items */}
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-forest-50 transition-colors"
                    >
                      <span>👤</span> My Profile
                    </Link>
                    <Link
                      to="/bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-forest-50 transition-colors"
                    >
                      <span>📅</span> My Bookings
                    </Link>
                    <Link
                      to="/tracker"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-forest-50 transition-colors"
                    >
                      <span>📊</span> Resource Tracker
                    </Link>

                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span>🚪</span> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // ── Not logged in: Login + Register ───────────────────────
              <>
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
              </>
            )}
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

          {/* Mobile auth section */}
          <div className="flex flex-col gap-2 pt-2 border-t border-forest-700">
            {user ? (
              <>
                {/* Mobile user info */}
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="flex items-center justify-center text-sm font-bold bg-yellow-400 rounded-full w-9 h-9 text-forest-900 shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <Link to="/profile"  onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-200 hover:text-white">👤 My Profile</Link>
                <Link to="/bookings" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-200 hover:text-white">📅 My Bookings</Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false) }}
                  className="block w-full px-3 py-2 text-sm text-left text-red-400 hover:text-red-300"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-200 hover:text-white">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-semibold text-center bg-yellow-400 rounded-md text-forest-900">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar