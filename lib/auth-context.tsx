'use client'

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getApiBaseUrl } from '@/lib/config'

export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin' | 'super-admin'
  phone?: string
  avatar?: {
    url: string
  }
  isActive: boolean
  lastLogin?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state from localStorage and fetch user data
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('authToken')

      if (savedToken) {
        setToken(savedToken)
        // Fetch user data from auth/me endpoint
        try {
          const baseUrl = getApiBaseUrl()
          const response = await fetch(`${baseUrl}/auth/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${savedToken}`,
            },
          })

          if (response.ok) {
            const data = await response.json() as { data: User }
            setUser(data.data)
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error)
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    try {
      const baseUrl = getApiBaseUrl()
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) throw new Error('Login failed')

      const data = await response.json() as { token: string; data: User }
      setToken(data.token)
      setUser(data.data)
      localStorage.setItem('authToken', data.token)
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setLoading(true)
    try {
      const baseUrl = getApiBaseUrl()
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'user' }),
      })

      if (!response.ok) throw new Error('Registration failed')

      const data = await response.json() as { token: string; data: User }
      setToken(data.token)
      setUser(data.data)
      localStorage.setItem('authToken', data.token)
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      const baseUrl = getApiBaseUrl()
      await fetch(`${baseUrl}/auth/logout`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setToken(null)
      setUser(null)
      localStorage.removeItem('authToken')
    }
  }

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      const baseUrl = getApiBaseUrl()
      const response = await fetch(`${baseUrl}/auth/updatedetails`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Update failed')

      const result = await response.json() as { data: User }
      setUser(result.data)
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      const baseUrl = getApiBaseUrl()
      const response = await fetch(`${baseUrl}/auth/updatepassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (!response.ok) throw new Error('Password update failed')

      const result = await response.json() as { token: string }
      setToken(result.token)
      localStorage.setItem('authToken', result.token)
    } catch (error) {
      console.error('Password update error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, updatePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
