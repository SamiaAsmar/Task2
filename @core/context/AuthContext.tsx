'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { User } from '../types/user'
import { ROLE_PERMISSIONS } from '../types/permissions'

type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  permissions: string[]
  login: (email: string, password: string, role: string) => Promise<void>
  logout: () => void
  fetchUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const permissions = user ? ROLE_PERMISSIONS[user.role] || [] : []

  const fetchUser = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (!storedToken || !storedUser) {
      setUser(null)
      setToken(null)
      setLoading(false)
      return
    }

    setToken(storedToken)
    setUser(JSON.parse(storedUser))
    setLoading(false)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const login = async (email: string, password: string, role: string) => {
    setLoading(true)

    const res = await axios.post('/api/login', { email, password, role })
    const { token, user } = res.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    setToken(token)
    setUser(user)
    setLoading(false)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        permissions,
        login,
        logout,
        fetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
