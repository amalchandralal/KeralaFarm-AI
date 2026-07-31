import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { 
      setError('Please fill in all fields.')
      return 
    }
    
    setLoading(true)
    setError('')
    
    try {
      const response = await loginUser({ email, password })
      setUser(response)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gray-50 font-sans">
      <div className="w-full max-w-md">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-emerald-50 text-emerald-600">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-500">Sign in to your AgroVision account</p>
        </div>

        {/* Card Section */}
        <div className="px-6 py-8 bg-white border border-gray-200 shadow-sm rounded-xl sm:px-10">
          
          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 p-3 mb-6 text-sm text-red-600 border border-transparent bg-red-50 rounded-lg animate-fade-in">
              <AlertCircle size={18} className="flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="block w-full h-11 px-3 py-2 text-gray-900 placeholder-gray-400 transition-colors border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 sm:text-sm"
                autoComplete="email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="block w-full h-11 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 transition-colors border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 sm:text-sm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="flex items-center justify-center w-full h-11 px-4 mt-2 text-sm font-medium text-white transition-colors bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-6 mt-6 border-t border-gray-100">
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-700">
                Create an account
              </Link>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default LoginPage