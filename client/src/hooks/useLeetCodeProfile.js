import { useMemo, useState } from 'react'
import { buildAnalysis, buildPlan, extractUsername, fetchProfile } from '../lib/leetcode.js'

export function useLeetCodeProfile() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(null)

  const [total, setTotal] = useState(10)
  const [solvedCount, setSolvedCount] = useState(4)

  const analysis = useMemo(() => (profile ? buildAnalysis(profile) : null), [profile])

  const safeSolved = Math.min(solvedCount, total)
  const plan = useMemo(
    () => (analysis ? buildPlan(analysis, total, safeSolved) : null),
    [analysis, total, safeSolved],
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    const user = extractUsername(input)
    if (!user) {
      setError('Enter a LeetCode profile URL or username.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const data = await fetchProfile(user)
      setProfile(data)
    } catch (err) {
      setError(err.message || 'Unable to fetch this profile.')
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setProfile(null)
    setInput('')
    setError('')
  }

  return {
    input,
    setInput,
    loading,
    error,
    profile,
    total,
    setTotal,
    solvedCount,
    setSolvedCount,
    analysis,
    safeSolved,
    plan,
    handleSubmit,
    reset,
  }
}
