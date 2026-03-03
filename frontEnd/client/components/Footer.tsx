import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="mt-auto bg-forest-800 text-forest-100">
      <div className="max-w-5xl px-4 py-10 mx-auto">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="flex items-center gap-2 mb-3 text-xl font-bold text-white">
              <span></span> KeralaFarm AI
            </h3>
            <p className="text-sm leading-relaxed text-forest-300">
              Voice-first AI assistant helping Kerala's smallholder farmers with crop disease detection, market prices, and farming guidance.
            </p>
            <p className="mt-2 text-xs text-forest-400" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
              കേരളത്തിലെ കർഷകർക്കായി
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-white">Features</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/voice" className="transition-colors hover:text-white"> Voice Assistant</Link></li>
              <li><Link to="/scan" className="transition-colors hover:text-white"> Disease Scanner</Link></li>
              <li><Link to="/places" className="transition-colors hover:text-white"> Places</Link></li>
              <li><Link to="/bookings" className="transition-colors hover:text-white"> Bookings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-white">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="transition-colors hover:text-white"> Login</Link></li>
              <li><Link to="/register" className="transition-colors hover:text-white"> Register</Link></li>
              <li><Link to="/profile" className="transition-colors hover:text-white"> Profile</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-4 mt-8 text-xs text-center border-t border-forest-700 text-forest-400">
          © {new Date().getFullYear()} KeralaFarm AI Assistant. Built for Kerala farmers.
        </div>
      </div>
    </footer>
  )
}

export default Footer
