// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { loginUser } from '../services/api'
// import { useAuth } from '../contexts/AuthContext'

// const LoginPage = () => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const { refreshUser } = useAuth()
//   const navigate = useNavigate()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!email || !password) { setError('Please fill in all fields.'); return }
//     setLoading(true)
//     setError('')
//     try {
//       await loginUser({ email, password })
//       await refreshUser()
//       navigate('/')
//     } catch (err: unknown) {
//       const e = err as { response?: { data?: { message?: string } } }
//       setError(e?.response?.data?.message || 'Login failed. Please check your credentials.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
//       <div className="w-full max-w-md">
//         <div className="mb-8 text-center">
//           <div className="mb-3 text-5xl"></div>
//           <h1 className="text-3xl font-bold text-forest-800">Welcome Back</h1>
//           <p className="mt-1 text-gray-500" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
//             തിരിച്ചുവരവിന് സ്വാഗതം
//           </p>
//         </div>

//         <div className="card">
//           {error && (
//             <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">
//                {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 placeholder="your@email.com"
//                 className="input-field"
//                 autoComplete="email"
//               />
//             </div>
//             <div>
//               <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="input-field"
//                 autoComplete="current-password"
//               />
//             </div>
//             <button type="submit" disabled={loading} className="flex items-center justify-center w-full gap-2 text-lg btn-primary">
//               {loading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
//                   Logging in...
//                 </>
//               ) : ' Login'}
//             </button>
//           </form>

//           <p className="mt-4 text-sm text-center text-gray-500">
//             Don't have an account?{' '}
//             <Link to="/register" className="font-medium text-forest-600 hover:underline">Register here</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default LoginPage
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { refreshUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { 
      setError('Please fill in all fields.')
      return 
    }
    
    setLoading(true)
    setError('')
    
    try {
      await loginUser({ email, password })
      await refreshUser()
      navigate('/')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e?.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gray-50/50">
      <div className="w-full max-w-md">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-5 rounded-full shadow-sm bg-emerald-100">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-sm tracking-wide text-gray-500" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
            തിരിച്ചുവരവിന് സ്വാഗതം
          </p>
        </div>

        {/* Card Section */}
        <div className="px-6 py-8 bg-white border border-gray-100 shadow-xl shadow-gray-200/50 rounded-2xl sm:px-10">
          
          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 p-4 mb-6 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl animate-fade-in">
              <svg className="flex-shrink-0 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block mb-1.5 text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="block w-full px-4 py-3 text-gray-900 transition-all duration-200 border border-gray-200 appearance-none bg-gray-50 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 sm:text-sm"
                autoComplete="email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block mb-1.5 text-sm font-semibold text-gray-700">
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
                  className="block w-full px-4 py-3 pr-10 text-gray-900 transition-all duration-200 border border-gray-200 appearance-none bg-gray-50 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 sm:text-sm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-emerald-600 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="relative flex items-center justify-center w-full px-4 py-3.5 mt-2 text-sm font-bold text-white transition-all duration-200 bg-emerald-600 border border-transparent rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-md"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-6 mt-6 border-t border-gray-100">
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold transition-colors duration-200 text-emerald-600 hover:text-emerald-700 hover:underline">
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