import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../lib/axios'

const ProfilePage = () => {
  const { user, logout, loading, setUser } = useAuth()
  const navigate = useNavigate()
  const [rawData, setRawData] = useState<unknown>(null)

  // Fetch profile directly so we can see exactly what the backend returns
  useEffect(() => {
    api.get('/profile')
      .then(res => {
        setRawData(res.data)
        // Try all common response shapes
        const d = res.data
        const extracted = d?.user || d?.data || d?.profile || (d?.name || d?.email ? d : null) || d
        setUser(extracted)
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-5xl">🌾</p>
        <p className="text-gray-500 text-lg">Please login to view your profile</p>
        <Link to="/login" className="btn-primary">🔑 Login</Link>
      </div>
    )
  }

  const name  = String(user.name  || user.username || user.fullName || '')
  const email = String(user.email || '')
  const role  = String(user.role  || user.userType || '')
  const initial = name ? name[0].toUpperCase() : email ? email[0].toUpperCase() : '?'

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto space-y-5">

        {/* Avatar */}
        <div className="card text-center py-8">
          <div className="w-24 h-24 rounded-full bg-forest-600 flex items-center justify-center text-4xl font-bold text-white mx-auto mb-4 shadow-lg">
            {initial}
          </div>
          {name  && <h1 className="text-2xl font-bold text-forest-800">{name}</h1>}
          {email && <p className="text-gray-500 mt-1">{email}</p>}
          {role  && <span className="badge bg-forest-100 text-forest-700 mt-3 capitalize">{role}</span>}
        </div>

        {/* Account Details */}
        <div className="card">
          <h2 className="font-bold text-forest-700 text-sm uppercase tracking-wide mb-3">Account Details</h2>
          <div className="space-y-0">
            {[
              { icon: '👤', label: 'Name',     value: name  },
              { icon: '✉️', label: 'Email',    value: email },
              { icon: '🏷️', label: 'Role',     value: role  },
              { icon: '📞', label: 'Phone',    value: String(user.phone    || user.mobile || '') },
              { icon: '📍', label: 'Location', value: String(user.location || user.address || user.district || '') },
              { icon: '📅', label: 'Joined',   value: user.createdAt || user.created_at
                  ? new Date(String(user.createdAt || user.created_at)).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                  : '' },
            ]
              .filter(row => row.value)
              .map((row, i, arr) => (
                <div key={row.label}
                  className={`flex justify-between items-center py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <span className="text-sm text-gray-500">{row.icon} {row.label}</span>
                  <span className="font-medium text-gray-800 max-w-[200px] text-right break-words">{row.value}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/bookings"
            className="card text-center hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer p-4">
            <p className="text-3xl mb-2">📅</p>
            <p className="font-semibold text-forest-700 text-sm">My Bookings</p>
          </Link>
          <Link to="/voice"
            className="card text-center hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer p-4">
            <p className="text-3xl mb-2">🎤</p>
            <p className="font-semibold text-forest-700 text-sm">Voice AI</p>
          </Link>
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className="btn-secondary w-full flex items-center justify-center gap-2 text-lg">
          🚪 Logout
        </button>

        {/* Debug panel — remove after confirming it works */}
        {rawData && (
          <details className="text-xs text-gray-400">
            <summary className="cursor-pointer select-none p-2">🔧 Debug: raw /profile response</summary>
            <pre className="bg-gray-50 p-3 rounded-lg overflow-auto text-xs mt-2 border">
              {JSON.stringify(rawData, null, 2)}
            </pre>
          </details>
        )}

      </div>
    </div>
  )
}

export default ProfilePage
