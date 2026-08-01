import { useDispatch, useSelector } from 'react-redux'
import {
  connectLeetCode,
  fetchLeetCodeProfile,
  syncLeetCodeProfile,
  disconnectLeetCodeProfile,
  clearLeetCodeError,
  selectLeetCodeProfile,
  selectLeetCodeConnected,
  selectLeetCodeLoading,
  selectLeetCodeError,
  selectLeetCodeLastSynced,
} from '../features/leetcode/leetcodeSlice.js'

// Centralized LeetCode hook exposing state + actions to components.
export const useLeetCode = () => {
  const dispatch = useDispatch()

  const profile = useSelector(selectLeetCodeProfile)
  const connected = useSelector(selectLeetCodeConnected)
  const loading = useSelector(selectLeetCodeLoading)
  const error = useSelector(selectLeetCodeError)
  const lastSynced = useSelector(selectLeetCodeLastSynced)

  return {
    profile,
    connected,
    loading,
    error,
    lastSynced,
    connect: (username) => dispatch(connectLeetCode(username)),
    fetchProfile: () => dispatch(fetchLeetCodeProfile()),
    sync: () => dispatch(syncLeetCodeProfile()),
    disconnect: () => dispatch(disconnectLeetCodeProfile()),
    clearError: () => dispatch(clearLeetCodeError()),
  }
}
