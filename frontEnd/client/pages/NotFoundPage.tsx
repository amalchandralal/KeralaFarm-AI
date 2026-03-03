import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
    <p className="mb-4 text-8xl"></p>
    <h1 className="mb-2 text-4xl font-bold text-forest-800">404</h1>
    <p className="mb-1 text-xl text-gray-600">Page not found</p>
    <p className="mb-6 text-gray-400" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
      ഈ പേജ് കണ്ടെത്തിയില്ല
    </p>
    <Link to="/" className="btn-primary"> Go Home</Link>
  </div>
)

export default NotFoundPage
