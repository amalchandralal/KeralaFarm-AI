import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-forest-800 text-forest-100 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span>🌾</span> KeralaFarm AI
            </h3>
            <p className="text-sm text-forest-300 leading-relaxed">
              Voice-first AI assistant helping Kerala's smallholder farmers with crop disease detection, market prices, and farming guidance.
            </p>
            <p className="text-xs text-forest-400 mt-2" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
              കേരളത്തിലെ കർഷകർക്കായി
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Features</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/voice" className="hover:text-white transition-colors">🎤 Voice Assistant</Link></li>
              <li><Link to="/scan" className="hover:text-white transition-colors">📷 Disease Scanner</Link></li>
              <li><Link to="/places" className="hover:text-white transition-colors">📍 Places</Link></li>
              <li><Link to="/bookings" className="hover:text-white transition-colors">📅 Bookings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">🔑 Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">📝 Register</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">👤 Profile</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-forest-700 mt-8 pt-4 text-center text-xs text-forest-400">
          © {new Date().getFullYear()} KeralaFarm AI Assistant. Built for Kerala farmers.
        </div>
      </div>
    </footer>
  )
}

export default Footer
