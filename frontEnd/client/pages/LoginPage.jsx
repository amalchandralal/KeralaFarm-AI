import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { loginUser } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LoginPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const [email, setEmail] = useState(() => location.state?.registeredEmail || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState(() => location.state?.message || '')

  const passwordRef = useRef(null)
  const emailRef = useRef(null)

  const from = location.state?.from?.pathname 
    ? `${location.state.from.pathname}${location.state.from.search || ''}` 
    : '/dashboard'

  useEffect(() => {
    if (location.state?.registeredEmail) {
      setEmail(location.state.registeredEmail)
      passwordRef.current?.focus()
    } else {
      emailRef.current?.focus()
    }
  }, [location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !password) { 
      setError('Please fill in all fields.')
      return 
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError('Please enter a valid email address.')
      return
    }
    
    setLoading(true)
    
    try {
      const response = await loginUser({ email: cleanEmail, password })
      // Response can be { user, token } or direct user object
      const userData = response?.user || response
      const token = response?.token

      if (token) {
        localStorage.setItem('agrovision_token', token)
      }

      setUser(userData)
      navigate(from, { replace: true })
    } catch (err) {
      let msg = err?.response?.data?.message || err?.response?.data?.error
      if (!msg) {
        if (!err.response || err.message === 'Network Error' || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
          msg = 'Backend server is waking up from sleep mode (Render Free Tier). Please wait a moment and try clicking Sign In again.'
        } else {
          msg = 'Login failed. Please check your email and password.'
        }
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-200">
      <div className="w-full max-w-md">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sign in to your AgroVision account</p>
        </div>

        {/* Card Section */}
        <div className="px-6 py-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl sm:px-10">
          
          {/* Success Alert (e.g. from registration) */}
          {successMsg && (
            <div className="flex items-start gap-3 p-3.5 mb-6 text-sm text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg animate-fade-in">
              <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
              <p className="leading-snug">{successMsg}</p>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-3 p-3.5 mb-6 text-sm text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 rounded-lg animate-fade-in">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <p className="leading-snug">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-200">
                Email Address
              </label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="block w-full h-11 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 sm:text-sm"
                autoComplete="email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-200">
                Password
              </label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="block w-full h-11 px-3 py-2 pr-10 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 sm:text-sm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="flex items-center justify-center w-full h-11 px-4 mt-2 text-sm font-medium text-white transition-all bg-emerald-600 dark:bg-emerald-500 rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
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
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-center text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
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