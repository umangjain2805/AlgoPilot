import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { clearCredentials } from './authSlice.js'

// Listens for global 401 events dispatched by the Axios interceptor.
export const AuthListener = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(clearCredentials())
      const isAuthPage = ['/login', '/register', '/'].includes(window.location.pathname)
      if (!isAuthPage) {
        window.location.assign('/login')
      }
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [dispatch])

  return null
}
