import api from './api'
import axios from 'axios'

// Derive backend root origin (e.g. http://127.0.0.1:8000) from VITE_API_BASE_URL
const getBaseOrigin = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
  return apiUrl.replace(/\/api\/?$/, '')
}

/**
 * Initialize Laravel Sanctum CSRF Cookie before authentication requests.
 */
export async function getCsrfCookie() {
  const baseOrigin = getBaseOrigin()
  return axios.get(`${baseOrigin}/sanctum/csrf-cookie`, {
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
    },
  })
}

/**
 * Register a new user account.
 * @param {Object} data - { name, email, password, password_confirmation }
 */
export async function register(data) {
  await getCsrfCookie()
  const response = await api.post('/register', data)
  return response.data
}

/**
 * Login user with credentials and start Sanctum session.
 * @param {Object} credentials - { email, password, remember }
 */
export async function login(credentials) {
  await getCsrfCookie()
  const response = await api.post('/login', credentials)
  return response.data
}

/**
 * Retrieve current authenticated user profile from backend session.
 */
export async function getCurrentUser() {
  const response = await api.get('/user')
  return response.data
}

/**
 * Log out and invalidate Sanctum session.
 */
export async function logout() {
  const response = await api.post('/logout')
  return response.data
}

/**
 * Verify administrator privileges on backend.
 */
export async function verifyAdmin() {
  const response = await api.get('/admin/verify')
  return response.data
}
