import { useState, useEffect, useCallback } from 'react'
import { AuthContext } from './authContextInstance'
import * as authService from '../services/authService'

const LEGACY_AUTH_STORAGE_KEY = 'gamevault_auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Clean up legacy mock auth storage key once on mount
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY)
      sessionStorage.removeItem('gamevault_temp_auth')
    } catch {
      // Ignore storage errors
    }
  }, [])

  // Check persistent Sanctum session from backend on application mount
  useEffect(() => {
    let isMounted = true

    authService
      .getCurrentUser()
      .then((res) => {
        if (isMounted && res?.data) {
          setUser(res.data)
        }
      })
      .catch(() => {
        if (isMounted) {
          setUser(null)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'admin'

  /**
   * Real Laravel Sanctum Login
   */
  const login = useCallback(async (email, password, rememberMe = true) => {
    try {
      const res = await authService.login({
        email: email.trim(),
        password,
        remember: rememberMe,
      })

      if (res?.data) {
        setUser(res.data)
        return { success: true, user: res.data }
      }

      return {
        success: false,
        message: 'Gagal masuk. Respons tidak valid dari server.',
      }
    } catch (err) {
      console.error('Login error:', err)
      const message =
        err.response?.data?.message ||
        'Email atau kata sandi yang Anda masukkan salah. Silakan coba kembali.'
      const errors = err.response?.data?.errors || {}

      return {
        success: false,
        message,
        errors,
      }
    }
  }, [])

  /**
   * Real Laravel Sanctum Registration
   */
  const register = useCallback(
    async ({ username, email, password, password_confirmation }) => {
      try {
        const res = await authService.register({
          name: username.trim(),
          email: email.trim(),
          password,
          password_confirmation,
        })

        if (res?.data) {
          setUser(res.data)
          return { success: true, user: res.data }
        }

        return {
          success: false,
          message: 'Pendaftaran gagal. Respons tidak valid dari server.',
        }
      } catch (err) {
        console.error('Registration error:', err)
        const message =
          err.response?.data?.message ||
          'Gagal mendaftarkan akun. Silakan periksa formulir input Anda.'
        const errors = err.response?.data?.errors || {}

        return {
          success: false,
          message,
          errors,
        }
      }
    },
    []
  )

  /**
   * Real Laravel Sanctum Logout
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error on backend:', err)
    } finally {
      setUser(null)
    }
  }, [])

  /**
   * Refresh current user profile from server
   */
  const refreshUser = useCallback(async () => {
    try {
      const res = await authService.getCurrentUser()
      if (res?.data) {
        setUser(res.data)
        return res.data
      }
    } catch {
      setUser(null)
    }
    return null
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
