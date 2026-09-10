import { createContext, useMemo, useState } from 'react'
import { buildAnalysis, buildPlan, extractUsername, fetchProfile } from '../lib/leetcode.js'

const STORAGE_KEY = 'ai-leetcode-coach:profile'

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
    // localStorage may fail in private mode or quota limit
  }
}

const clearSnapshot = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

const LeetCodeContext = createContext(null)

export function LeetCodeProvider({ children }) {
  const [snapshot] = useState(loadSaved)

  const [input, setInput] = useState(snapshot.profile?.leetcodeUsername ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(snapshot.profile)
  const [savedAt, setSavedAt] = useState(snapshot.savedAt)
  const [total, setTotal] = useState(10)
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const analysis = useMemo(() => (profile ? buildAnalysis(profile) : null), [profile])

  const plan = useMemo(
    () => (analysis ? buildPlan(analysis, total, selectedTopic, selectedDifficulty) : null),
    [analysis, total, selectedTopic, selectedDifficulty],
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
    if (event?.preventDefault) event.preventDefault()
    const user = extractUsername(input)
    if (!user) {
      setError('Enter a LeetCode profile URL or username.')
      return
    }
    await runFetch(user)
  }

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

  const value = {
    input,
    setInput,
    loading,
    error,
    profile,
    savedAt,
    total,
    setTotal,
    selectedTopic,
    setSelectedTopic,
    selectedDifficulty,
    setSelectedDifficulty,
    analysis,
    plan,
    handleSubmit,
    sync,
    reset,
  }

  return <LeetCodeContext.Provider value={value}>{children}</LeetCodeContext.Provider>
}

export { LeetCodeContext }

