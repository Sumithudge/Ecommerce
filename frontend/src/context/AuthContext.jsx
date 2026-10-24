import { createContext, useContext, useEffect, useState } from 'react'
import { getMe, loginUser, registerUser } from '../services/api.js'

const AuthContext = createContext(null)
const TOKEN_KEY = 'elora-token'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) { setLoading(false); return }
    getMe(token).then(data => setUser(data.user)).catch(() => {
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
    }).finally(() => setLoading(false))
  }, [token])

  async function login(credentials) {
    const data = await loginUser(credentials)
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token); setUser(data.user)
    return data.user
  }

  async function register(payload) {
    const data = await registerUser(payload)
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token); setUser(data.user)
    return data.user
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null); setUser(null)
  }

  return <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}
