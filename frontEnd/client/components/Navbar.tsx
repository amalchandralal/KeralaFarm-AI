import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navLinks = [
    { to: '/',          label: 'Home'      },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/voice',     label: 'Voice AI'  },
    { to: '/scan',      label: 'Scan Crop' },
    { to: '/tracker',   label: 'Tracker'   },
    { to: '/offline',   label: 'Offline'   },
    { to: '/places',    label: 'Places'    },
    { to: '/bookings',  label: 'Bookings'  }, // ✅ Added to desktop nav
  ]

  // Fixed: use exact match to avoid /places matching /places-xyz etc.
  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname === to || location.pathname.startsWith(to + '/')

  return (
    <nav className="sticky top-0 z-50 text-white shadow-lg bg-forest-700">
      <div className="max-w-6xl px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 gap-2 text-lg font-bold">
            <span className="text-2xl">🌾</span>
            <span className="hidden sm:block">KeralaFarm AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`px-2.5 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-forest-600 whitespace-nowrap ${
                  isActive(link.to) ? 'bg-forest-600' : ''}`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="items-center flex-shrink-0 hidden gap-2 lg:flex">
            {user ? (
              <>
                <Link to="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-forest-600">
                  <span className="flex items-center justify-center text-sm font-bold rounded-full w-7 h-7 bg-forest-400">
                    {String(user.name || user.email || '?')[0].toUpperCase()}
                  </span>
                  <span className="max-w-[80px] truncate">{user.name as string}</span>
                </Link>
                <button onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium transition-colors rounded-lg bg-earth-500 hover:bg-earth-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-sm rounded-lg hover:bg-forest-600">Login</Link>
                <Link to="/register" className="px-3 py-2 text-sm font-medium rounded-lg bg-earth-500 hover:bg-earth-600">Register</Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button className="p-2 rounded-lg lg:hidden hover:bg-forest-600"
            onClick={() => setMenuOpen(!menuOpen)}>
            <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="px-4 pb-4 lg:hidden bg-forest-800">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg my-0.5 text-base hover:bg-forest-700 ${
                isActive(link.to) ? 'bg-forest-700' : ''}`}>
              {link.label}
            </Link>
          ))}
          <div className="pt-2 mt-2 border-t border-forest-700">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-forest-700">
                  👤 {user.name as string || 'Profile'}
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false) }}
                  className="flex items-center w-full gap-3 px-3 py-3 text-left rounded-lg hover:bg-forest-700 text-earth-300">
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-forest-700">🔑 Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-forest-700">📝 Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar