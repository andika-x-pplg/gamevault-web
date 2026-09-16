import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

// Optional response interceptor for unified error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Pass along the error for components/services to catch
    return Promise.reject(error)
  }
)

export default api
