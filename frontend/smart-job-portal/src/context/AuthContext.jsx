import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const login = (authResponse) => {
    const userData = {
      id: authResponse.id,
      fullName: authResponse.fullName,
      email: authResponse.email,
      role: authResponse.role,
      status: authResponse.status,
    }
    localStorage.setItem('token', authResponse.token)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(authResponse.token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = !!token && !!user
  const isJobSeeker = user?.role === 'JOB_SEEKER'
  const isRecruiter = user?.role === 'RECRUITER'
  const isAdmin = user?.role === 'ADMIN'

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isJobSeeker, isRecruiter, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
