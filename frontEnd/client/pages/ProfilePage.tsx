import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../lib/axios'

const ProfilePage = () => {
  const { user, logout, loading, setUser } = useAuth()
  const navigate = useNavigate()
  const [rawData, setRawData] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    api.get('/profile')
      .then(res => {
        setRawData(res.data)
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
        <div className="w-10 h-10 border-4 rounded-full border-forest-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-lg text-gray-500">Please login to view your profile</p>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    )
  }

  const name     = String(user.name     || user.username || user.fullName || '')
  const email    = String(user.email    || '')
  const role     = String(user.role     || user.userType || '')
  const initial  = name ? name[0].toUpperCase() : email ? email[0].toUpperCase() : '?'

  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto space-y-5">

        {/* Avatar */}
        <div className="py-8 text-center card">
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 text-4xl font-bold text-white rounded-full shadow-lg bg-forest-600">
            {initial}
          </div>
          {name  && <h1 className="text-2xl font-bold text-forest-800">{name}</h1>}
          {email && <p className="mt-1 text-gray-500">{email}</p>}
          {role  && <span className="mt-3 capitalize badge bg-forest-100 text-forest-700">{role}</span>}
        </div>

        {/* Account Details */}
        <div className="card">
          <h2 className="mb-3 text-sm font-bold tracking-wide uppercase text-forest-700">Account Details</h2>
          <div className="space-y-0">
            {[
              { label: 'Name',     value: name  },
              { label: 'Email',    value: email },
              { label: 'Role',     value: role  },
              { label: 'Phone',    value: String(user.phone    || user.mobile  || '') },
              { label: 'Location', value: String(user.location || user.address || user.district || '') },
              { label: 'Joined',   value: user.createdAt || user.created_at
                  ? new Date(String(user.createdAt || user.created_at)).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                  : '' },
            ]
              .filter(row => row.value)
              .map((row, i, arr) => (
                <div key={row.label}
                  className={`flex justify-between items-center py-3 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <span className="text-sm text-gray-500">{row.label}</span>
                  <span className="font-medium text-gray-800 max-w-[200px] text-right break-words">{row.value}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/bookings"
            className="p-4 text-center transition-all cursor-pointer card hover:shadow-lg hover:-translate-y-1">
            <p className="text-sm font-semibold text-forest-700">My Bookings</p>
          </Link>
          <Link to="/voice"
            className="p-4 text-center transition-all cursor-pointer card hover:shadow-lg hover:-translate-y-1">
            <p className="text-sm font-semibold text-forest-700">Voice AI</p>
          </Link>
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className="flex items-center justify-center w-full gap-2 text-lg btn-secondary">
          Logout
        </button>

        {/* Debug panel — remove after confirming it works */}
        {rawData && (
          <details className="text-xs text-gray-400">
            <summary className="p-2 cursor-pointer select-none">Debug: raw /profile response</summary>
            <pre className="p-3 mt-2 overflow-auto text-xs border rounded-lg bg-gray-50">
              {JSON.stringify(rawData, null, 2)}
            </pre>
          </details>
        )}

      </div>
    </div>
  )
}

export default ProfilePage