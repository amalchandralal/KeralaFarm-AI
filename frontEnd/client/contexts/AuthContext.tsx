import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getProfile, logoutUser } from '../services/api'

export interface User {
  name?: string
  email?: string
  role?: string
  phone?: string
  location?: string
  createdAt?: string
  created_at?: string
  _id?: string
  [key: string]: unknown
}

interface AuthContextType {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const data = await getProfile()
      // Handle multiple response shapes:
      // { name, email } OR { user: { name, email } } OR { data: { name, email } }
      const extracted =
        data?.user ||
        data?.data ||
        data?.profile ||
        (data?.name || data?.email ? data : null)
      setUser(extracted || data)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try { await logoutUser() } catch { /* ignore */ }
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
