import { useDispatch, useSelector } from 'react-redux'
import {
  registerUser,
  loginUser,
  logoutUser,
  fetchCurrentUser,
  loginWithGoogle,
  loginAsGuest,
  clearError,
} from '../features/auth/authSlice.js'

// Centralized auth hook exposing state + actions to components.
export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, token, isLoading, error, guestMode, isAuthenticated, status } = useSelector(
    (state) => state.auth,
  )

  return {
    user,
    token,
    isLoading,
    error,
    guestMode,
    isAuthenticated,
    status,
    isGuest: guestMode,
    register: (data) => dispatch(registerUser(data)),
    login: (data) => dispatch(loginUser(data)),
    logout: () => dispatch(logoutUser()),
    getMe: () => dispatch(fetchCurrentUser()),
    googleLogin: (idToken) => dispatch(loginWithGoogle(idToken)),
    guestLogin: (data) => dispatch(loginAsGuest(data)),
    clearError: () => dispatch(clearError()),
  }
}
