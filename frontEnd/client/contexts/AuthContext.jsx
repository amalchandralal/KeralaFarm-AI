import React, { createContext, useContext, useState, useEffect } from 'react'
import { getProfile, logoutUser } from '../services/api'

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('agrovision_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(() => {
    // If we already have a cached token, don't show full-page blocking loader
    return !localStorage.getItem('agrovision_token');
  });

  const updateUser = (newUser) => {
    if (newUser) {
      localStorage.setItem('agrovision_user', JSON.stringify(newUser));
      setUser(newUser);
    } else {
      localStorage.removeItem('agrovision_user');
      setUser(null);
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('agrovision_token');
    if (!token) {
      updateUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await getProfile();

      // If backend returns error or invalid payload
      if (!data || typeof data === 'string' || data?.error) {
        localStorage.removeItem('agrovision_token');
        updateUser(null);
        return;
      }

      const extracted =
        data?.user ||
        data?.data ||
        data?.profile ||
        (data?.name || data?.email ? data : null);

      if (extracted) {
        updateUser(extracted);
      } else {
        localStorage.removeItem('agrovision_token');
        updateUser(null);
      }
    } catch {
      // If profile fails with 401 or invalid token
      localStorage.removeItem('agrovision_token');
      updateUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      /* ignore */
    }
    localStorage.removeItem('agrovision_token');
    updateUser(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser: updateUser, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}