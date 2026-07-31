import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SearchX } from 'lucide-react'

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 bg-gray-50 font-sans">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center"
    >
      <div className="mb-6 text-gray-300">
        <SearchX size={64} strokeWidth={1.5} />
      </div>
      <h1 className="mb-2 text-6xl font-bold tracking-tight text-gray-200">404</h1>
      <p className="mb-2 text-xl font-medium text-gray-900">Page not found</p>
      <p className="mb-8 text-sm text-gray-500">The page you are looking for doesn't exist or has been moved.</p>
      <Link 
        to="/" 
        className="inline-flex items-center justify-center h-10 px-6 text-sm font-medium text-white transition-colors bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
      >
        Go Home
      </Link>
    </motion.div>
  </div>
)

export default NotFoundPage