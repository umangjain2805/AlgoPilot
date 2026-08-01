import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchCurrentUser, clearCredentials } from './authSlice.js'

// On app load, verifies the session with the backend (GET /auth/me).
// If the persisted user is present but the token is invalid, clears credentials.
export const AuthBootstrap = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const persisted = localStorage.getItem('ai_leetcode_coach_auth')
    if (persisted) {
      dispatch(fetchCurrentUser()).then((action) => {
        if (action.type.endsWith('/rejected')) {
          dispatch(clearCredentials())
        }
      })
    }
  }, [dispatch])

  return null
}
