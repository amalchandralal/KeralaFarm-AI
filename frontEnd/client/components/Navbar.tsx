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
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/voice', label: 'Voice AI', icon: '🎤' },
    { to: '/scan', label: 'Scan Crop', icon: '📷' },
    { to: '/places', label: 'Places', icon: '📍' },
    { to: '/bookings', label: 'Bookings', icon: '📅' },
  ]

  return (
    <nav className="bg-forest-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl">🌾</span>
            <span className="hidden sm:block">KeralaFarm AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-forest-600 ${
                  location.pathname === link.to ? 'bg-forest-600' : ''
                }`}
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-forest-600 text-sm">
                  <span className="w-7 h-7 rounded-full bg-forest-400 flex items-center justify-center font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                  <span>{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="px-3 py-2 rounded-lg bg-earth-500 hover:bg-earth-600 text-sm font-medium transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded-lg hover:bg-forest-600 text-sm">Login</Link>
                <Link to="/register" className="px-3 py-2 rounded-lg bg-earth-500 hover:bg-earth-600 text-sm font-medium">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-forest-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-forest-800 px-4 pb-4">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg my-1 text-base hover:bg-forest-700 ${
                location.pathname === link.to ? 'bg-forest-700' : ''
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          <div className="border-t border-forest-700 mt-2 pt-2">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-forest-700">
                  👤 {user.name}
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-forest-700 text-earth-300">
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
