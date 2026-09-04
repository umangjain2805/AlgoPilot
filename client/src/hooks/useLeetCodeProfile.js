import { useMemo, useState } from 'react'
import { buildAnalysis, buildPlan, extractUsername, fetchProfile } from '../lib/leetcode.js'

const STORAGE_KEY = 'ai-leetcode-coach:profile'

// Persisted shape: { profile, savedAt } — the last fetched LeetCode snapshot.
// `profile.solvedSlugs` is the list of solved questions used to rebuild the analysis.
const loadSaved = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { profile: null, savedAt: null }
    const parsed = JSON.parse(raw)
    return { profile: parsed?.profile ?? null, savedAt: parsed?.savedAt ?? null }
  } catch {
    return { profile: null, savedAt: null }
  }
}

const saveSnapshot = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, savedAt: Date.now() }))
  } catch {
    // localStorage can be blocked (private mode) or full — keep the data in memory only.
  }
}

const clearSnapshot = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function useLeetCodeProfile() {
  const [snapshot] = useState(loadSaved)

  const [input, setInput] = useState(snapshot.profile?.leetcodeUsername ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(snapshot.profile)
  const [savedAt, setSavedAt] = useState(snapshot.savedAt)

  const [total, setTotal] = useState(10)

  const analysis = useMemo(() => (profile ? buildAnalysis(profile) : null), [profile])

  const plan = useMemo(
    () => (analysis ? buildPlan(analysis, total) : null),
    [analysis, total],
  )

  const runFetch = async (username) => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchProfile(username)
      setProfile(data)
      setSavedAt(Date.now())
      saveSnapshot(data)
    } catch (err) {
      setError(err.message || 'Unable to fetch this profile.')
      setProfile(null)
      setSavedAt(null)
      clearSnapshot()
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const user = extractUsername(input)
    if (!user) {
      setError('Enter a LeetCode profile URL or username.')
      return
    }
    await runFetch(user)
  }

  // Re-fetches the solved questions and recalculates the suggestions.
  const sync = async () => {
    const username = profile?.leetcodeUsername
    if (!username) return
    await runFetch(username)
  }

  const reset = () => {
    setProfile(null)
    setInput('')
    setError('')
    setSavedAt(null)
    clearSnapshot()
  }

  return {
    input,
    setInput,
    loading,
    error,
    profile,
    savedAt,
    total,
    setTotal,
    analysis,
    plan,
    handleSubmit,
    sync,
    reset,
    runFetch,
  }
}
