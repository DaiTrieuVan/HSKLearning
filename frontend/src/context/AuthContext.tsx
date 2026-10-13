import React, { createContext, useContext, useState, useEffect } from 'react'
import type { LoginResponse } from '../types/auth'
import { logoutUser } from '../api/auth'

interface AuthContextType {
  user: LoginResponse | null
  token: string | null
  isLoggedIn: boolean
  login: (data: LoginResponse) => void
  logout: () => Promise<void>
  switchMode: (mode: 'STUDENT' | 'TEACHER') => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'hsk_auth_session'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<LoginResponse | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [session])

  const login = (data: LoginResponse) => {
    setSession(data)
  }

  const logout = async () => {
    await logoutUser()
    setSession(null)
  }

  const switchMode = (mode: 'STUDENT' | 'TEACHER') => {
    if (session && session.roles.includes(mode)) {
      setSession({ ...session, activeMode: mode })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: session,
        token: session?.token || null,
        isLoggedIn: !!session,
        login,
        logout,
        switchMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
