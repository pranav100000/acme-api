import React, { createContext, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'acme_user'
const AuthContext = createContext(null)

function getStoredUser() {
  const savedUser = localStorage.getItem(STORAGE_KEY)
  return savedUser ? JSON.parse(savedUser) : null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const value = useMemo(() => ({
    user,
    login(userData) {
      setUser(userData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    },
    logout() {
      setUser(null)
      localStorage.removeItem(STORAGE_KEY)
    }
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
