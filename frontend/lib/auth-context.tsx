'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { authApi } from '@/lib/admin-api'
import type { Admin } from '@/lib/types'

interface AuthContextValue {
  admin: Admin | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    authApi
      .me()
      .then((raw) => setAdmin({ id: raw.id, name: raw.name, email: raw.email }))
      .catch(() => setAdmin(null))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const raw = await authApi.login(email, password)
    setAdmin({ id: raw.id, name: raw.name, email: raw.email })
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      setAdmin(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ admin, isLoading, isAuthenticated: !!admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
