import { useContext } from 'react'
import { LeetCodeContext } from '../context/LeetCodeContext.jsx'

export function useLeetCode() {
  const context = useContext(LeetCodeContext)
  if (!context) {
    throw new Error('useLeetCode must be used within a LeetCodeProvider')
  }
  return context
}
