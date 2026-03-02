import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
    <p className="text-8xl mb-4">🌾</p>
    <h1 className="text-4xl font-bold text-forest-800 mb-2">404</h1>
    <p className="text-xl text-gray-600 mb-1">Page not found</p>
    <p className="text-gray-400 mb-6" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
      ഈ പേജ് കണ്ടെത്തിയില്ല
    </p>
    <Link to="/" className="btn-primary">🏠 Go Home</Link>
  </div>
)

export default NotFoundPage
