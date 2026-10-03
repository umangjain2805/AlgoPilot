import { createContext, useEffect, useMemo, useRef, useState } from 'react'
import { buildAnalysis, buildPlan, extractUsername, fetchProfile } from '../lib/leetcode.js'
import { mergeProgress, normalizeProgress, parseSolvedHistory } from '../lib/practice.js'

const STORAGE_KEY = 'ai-leetcode-coach:profile'
const PROGRESS_KEY = 'ai-leetcode-coach:progress:v2'
const readSaved = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback
  } catch {
    return fallback
  }
}
const accountKey = (username) => String(username || '').toLowerCase()
const LeetCodeContext = createContext(null)

export function LeetCodeProvider({ children }) {
  const [snapshot] = useState(() => readSaved(STORAGE_KEY, {}))
  const [input, setInput] = useState(snapshot.profile?.leetcodeUsername || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [storageWarning, setStorageWarning] = useState('')
  const [profile, setProfile] = useState(snapshot.profile || null)
  const [savedAt, setSavedAt] = useState(snapshot.savedAt || null)
  const [accounts, setAccounts] = useState(() => readSaved(PROGRESS_KEY, {}))
  const accountsRef = useRef(accounts)
  const profileRef = useRef(profile)
  const requestId = useRef(0)
  const [total, setTotal] = useState(10)
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [mode, setMode] = useState('new')
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(timer)
  }, [])
  const progress = useMemo(
    () => normalizeProgress(accounts[accountKey(profile?.leetcodeUsername)]),
    [accounts, profile],
  )
  const analysis = useMemo(
    () => (profile ? buildAnalysis(profile, progress, now) : null),
    [profile, progress, now],
  )
  const plan = useMemo(
    () =>
      analysis ? buildPlan(analysis, total, selectedTopic, selectedDifficulty, mode, now) : null,
    [analysis, total, selectedTopic, selectedDifficulty, mode, now],
  )

  const persist = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      setStorageWarning('')
    } catch {
      setStorageWarning('Browser storage is unavailable. Export a backup to keep your progress.')
    }
  }
  const updateProgress = (transform, username = profileRef.current?.leetcodeUsername) => {
    if (!username) return
    const key = accountKey(username)
    const next = {
      ...accountsRef.current,
      [key]: normalizeProgress(transform(normalizeProgress(accountsRef.current[key]))),
    }
    accountsRef.current = next
    setAccounts(next)
    persist(PROGRESS_KEY, next)
  }
  const runFetch = async (username) => {
    const id = ++requestId.current
    setLoading(true)
    setError('')
    try {
      const data = await fetchProfile(username)
      if (id !== requestId.current) return
      updateProgress(
        (current) => mergeProgress(current, { solvedSlugs: data.solvedSlugs }),
        data.leetcodeUsername,
      )
      profileRef.current = data
      setProfile(data)
      setSavedAt(data.fetchedAt || Date.now())
      persist(STORAGE_KEY, { profile: data, savedAt: data.fetchedAt || Date.now() })
    } catch (err) {
      if (id === requestId.current)
        setError(
          err.name === 'TimeoutError'
            ? 'The request timed out. Your saved profile is still available.'
            : err.message || 'Unable to fetch this profile.',
        )
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }
  const handleSubmit = async (event) => {
    event?.preventDefault()
    const username = extractUsername(input)
    if (!username) {
      setError('Enter a LeetCode username or a valid leetcode.com profile URL.')
      return
    }
    await runFetch(username)
  }
  const sync = () =>
    profileRef.current ? runFetch(profileRef.current.leetcodeUsername) : undefined
  const reset = () => {
    requestId.current += 1
    profileRef.current = null
    setProfile(null)
    setInput('')
    setError('')
    setSavedAt(null)
    setLoading(false)
    setSelectedTopic('all')
    setSelectedDifficulty('all')
    setMode('new')
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* progress can still be exported */
    }
  }
  const completeProblem = (slug, revision = false) =>
    updateProgress((current) => {
      const at = Date.now(),
        prior = current.reviews[slug]
      return {
        ...current,
        skippedSlugs: current.skippedSlugs.filter((item) => item !== slug),
        reviews: {
          ...current.reviews,
          [slug]: { completedAt: at, count: revision ? (prior?.count || 0) + 1 : 0 },
        },
        activity: [...current.activity, { slug, at, type: revision ? 'review' : 'solve' }],
      }
    })
  const skipProblem = (slug) =>
    updateProgress((current) => ({ ...current, skippedSlugs: [...current.skippedSlugs, slug] }))
  const restoreSkipped = () => updateProgress((current) => ({ ...current, skippedSlugs: [] }))
  const importHistory = (text) => {
    const parsed = parseSolvedHistory(text)
    updateProgress((current) => mergeProgress(current, parsed))
    return parsed.solvedIds.length + parsed.solvedSlugs.length
  }
  const restoreBackup = (text) => {
    if (text.length > 2000000) throw new Error('Backup must be smaller than 2 MB.')
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      throw new Error('This file is not valid JSON.')
    }
    if (
      parsed?.version !== 2 ||
      !parsed.progress ||
      typeof parsed.progress !== 'object' ||
      Array.isArray(parsed.progress) ||
      accountKey(parsed.username) !== accountKey(profileRef.current?.leetcodeUsername)
    ) {
      throw new Error('Use a Coach backup belonging to the currently loaded username.')
    }
    updateProgress((current) => mergeProgress(current, parsed.progress))
  }
  const undoCompletion = (slug) =>
    updateProgress((current) => {
      const activity = [...current.activity]
      const index = activity.findLastIndex((item) => item.slug === slug)
      if (index < 0) return current
      activity.splice(index, 1)
      const reviews = { ...current.reviews }
      delete reviews[slug]
      for (const item of activity.filter((entry) => entry.slug === slug)) {
        reviews[slug] = {
          completedAt: item.at,
          count: item.type === 'solve' ? 0 : (reviews[slug]?.count || 0) + 1,
        }
      }
      // Imported and publicly reported solves are preserved when undoing local actions.
      return { ...current, reviews, activity }
    })
  return (
    <LeetCodeContext.Provider
      value={{
        input,
        setInput,
        loading,
        error,
        storageWarning,
        profile,
        savedAt,
        total,
        setTotal,
        selectedTopic,
        setSelectedTopic,
        selectedDifficulty,
        setSelectedDifficulty,
        mode,
        setMode,
        progress,
        analysis,
        plan,
        handleSubmit,
        sync,
        reset,
        completeProblem,
        skipProblem,
        restoreSkipped,
        importHistory,
        restoreBackup,
        undoCompletion,
        setDailyGoal: (dailyGoal) => updateProgress((current) => ({ ...current, dailyGoal })),
      }}
    >
      {children}
    </LeetCodeContext.Provider>
  )
}

export { LeetCodeContext }
