import axios from 'axios'

// Centralized Axios instance for all API calls.
// - Sends credentials (HttpOnly cookie) with every request.
// - Optionally attaches a Bearer token when present.
// - Handles 401 responses by dispatching logout.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT token (localStorage fallback) if available.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Handle unauthorized responses.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const originalRequest = error.config

    // Only attempt logout redirect once per failed request to avoid loops.
    if (status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true
      localStorage.removeItem('token')
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  },
)

export default api
