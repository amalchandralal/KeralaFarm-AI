import React from 'react'
import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
    <SearchX size={64} className="mb-4 text-forest-300" />
    <h1 className="mb-2 text-4xl font-bold text-forest-800">404</h1>
    <p className="mb-6 text-xl text-gray-600">Page not found</p>
    <Link to="/" className="btn-primary">Go Home</Link>
  </div>
)

export default NotFoundPage