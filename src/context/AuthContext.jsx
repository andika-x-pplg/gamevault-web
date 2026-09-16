import { useState, useEffect } from 'react'
import { AuthContext } from './authContextInstance'
import { DEMO_USER, ADMIN_USER } from '../data/authDemo'

const AUTH_STORAGE_KEY = 'gamevault_auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'admin'

  // Synchronize non-sensitive user profile to localStorage if session exists
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    } catch {
      // Ignore storage write errors in private browsing
    }
  }, [user])

  /**
   * Mock login function
   * In production, this will be replaced with an axios/fetch call to Laravel Sanctum / JWT API
   */
  const login = async (email, password, rememberMe = true) => {
    // Simulate brief network latency
    await new Promise((resolve) => setTimeout(resolve, 300))

    const cleanEmail = email.trim().toLowerCase()

    // Check admin credentials
    if (cleanEmail === ADMIN_USER.email.toLowerCase() && password === 'GameVaultAdmin123!') {
      const authUser = { ...ADMIN_USER }
      setUser(authUser)
      if (!rememberMe) {
        sessionStorage.setItem('gamevault_temp_auth', 'true')
      }
      return { success: true, user: authUser }
    }

    // Check demo credentials
    if (cleanEmail === DEMO_USER.email.toLowerCase() && password === 'GameVault123!') {
      const authUser = { ...DEMO_USER }
      setUser(authUser)
      if (!rememberMe) {
        sessionStorage.setItem('gamevault_temp_auth', 'true')
      }
      return { success: true, user: authUser }
    }

    // Allow mock login for any valid email if password length >= 6 for testing convenience
    if (cleanEmail.includes('@') && password.length >= 6) {
      const customUsername = cleanEmail.split('@')[0]
      const customUser = {
        id: `usr-${Date.now()}`,
        username: customUsername.charAt(0).toUpperCase() + customUsername.slice(1),
        email: cleanEmail,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        joinedDate: new Date().toISOString().split('T')[0],
      }
      setUser(customUser)
      return { success: true, user: customUser }
    }

    return {
      success: false,
      message: 'Email atau password salah. Cek demo@gamevault.dev (user) atau admin@gamevault.dev (admin).',
    }
  }

  /**
   * Mock register function
   * In production, this will be replaced with Laravel registration endpoint
   */
  const register = async ({ username, email, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (!username || !email || !password) {
      return { success: false, message: 'Semua field wajib diisi.' }
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      joinedDate: new Date().toISOString().split('T')[0],
    }

    setUser(newUser)
    return { success: true, user: newUser }
  }

  /**
   * Logout function
   */
  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      sessionStorage.removeItem('gamevault_temp_auth')
    } catch {
      // Ignore errors
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
