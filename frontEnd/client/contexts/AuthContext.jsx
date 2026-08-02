import React, { createContext, useContext, useState, useEffect } from 'react'
import { getProfile, logoutUser } from '../services/api'

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const data = await getProfile()

      // ── If backend returns "Not logged in" string → not authenticated ──
      if (!data || typeof data === 'string') {
        setUser(null)
        localStorage.removeItem('agrovision_token')
        return
      }

      // ── If backend returns { error: ... } → not authenticated ──────────
      if (data?.error) {
        setUser(null)
        localStorage.removeItem('agrovision_token')
        return
      }

      // ── Extract user from various response shapes ──────────────────────
      const extracted =
        data?.user ||
        data?.data ||
        data?.profile ||
        (data?.name || data?.email ? data : null)

      setUser(extracted || null)
      if (!extracted) {
        localStorage.removeItem('agrovision_token')
      }
    } catch {
      setUser(null)
      localStorage.removeItem('agrovision_token')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try { await logoutUser() } catch { /* ignore */ }
    localStorage.removeItem('agrovision_token')
    setUser(null)
  }

  useEffect(() => { refreshUser() }, [])

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}