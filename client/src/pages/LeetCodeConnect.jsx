import { useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth.js'
import { useLeetCode } from '../hooks/useLeetCode.js'
import Spinner from '../components/Spinner.jsx'
import LeetCodeConnectForm from '../components/leetcode/LeetCodeConnectForm.jsx'
import LeetCodeProfileHeader from '../components/leetcode/LeetCodeProfileHeader.jsx'
import LeetCodeStatsGrid from '../components/leetcode/LeetCodeStatsGrid.jsx'
import LeetCodeContestCard from '../components/leetcode/LeetCodeContestCard.jsx'
import LeetCodeBadges from '../components/leetcode/LeetCodeBadges.jsx'
import LeetCodeRecentSubmissions from '../components/leetcode/LeetCodeRecentSubmissions.jsx'
import LeetCodeHeatmapPlaceholder from '../components/leetcode/LeetCodeHeatmapPlaceholder.jsx'
import LeetCodeActions from '../components/leetcode/LeetCodeActions.jsx'

const LeetCodeConnect = () => {
  const { isGuest } = useAuth()
  const {
    profile,
    connected,
    loading,
    error,
    lastSynced,
    connect,
    fetchProfile,
    sync,
    disconnect,
    clearError,
  } = useLeetCode()

  const loadProfile = useCallback(() => {
    fetchProfile().then((action) => {
      const is404 = action?.payload === 'No LeetCode profile is connected yet'
      if (action.type.endsWith('/rejected') && !is404) {
        toast.error(action.payload || 'Unable to load LeetCode profile')
      }
    })
  }, [fetchProfile])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const handleConnect = async ({ username }) => {
    const result = await connect(username.trim())
    if (!result.error) {
      toast.success('Profile Connected')
    }
  }

  const handleSync = async () => {
    const result = await sync()
    if (!result.error) {
      toast.success('Profile Updated')
    }
  }

  const handleDisconnect = async () => {
    const result = await disconnect()
    if (!result.error) {
      toast.success('Profile Disconnected')
    }
  }

  if (isGuest) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <div className="glass-card rounded-3xl p-10">
          <span className="text-5xl">🔒</span>
          <h1 className="font-display mt-4 text-2xl font-bold text-ink-900 dark:text-white">
            Guests can&apos;t connect LeetCode profiles
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-600 dark:text-ink-300">
            Create a free account to link your LeetCode profile and unlock personalized analysis.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white">
          Connect Your LeetCode Account
        </h1>
        <p className="text-ink-600 dark:text-ink-300">
          Link your username to fetch and store your public LeetCode data.
        </p>
      </div>

      {loading && !connected ? (
        <div className="mt-16 grid place-items-center">
          <Spinner size="lg" />
        </div>
      ) : connected && profile ? (
        <div className="mt-10 space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <LeetCodeProfileHeader profile={profile} />
          </div>

          <LeetCodeStatsGrid profile={profile} />

          <div className="grid gap-6 lg:grid-cols-2">
            <LeetCodeContestCard profile={profile} />
            <LeetCodeBadges badges={profile.badges} />
          </div>

          <LeetCodeHeatmapPlaceholder />

          <LeetCodeRecentSubmissions submissions={profile.recentSubmissions} />

          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <LeetCodeActions
              onSync={handleSync}
              onDisconnect={handleDisconnect}
              loading={loading}
              lastSynced={lastSynced}
            />
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-10 max-w-lg">
          <div className="glass-card rounded-3xl p-8 sm:p-10">
            <div className="mb-6 text-center">
              <span className="text-5xl">🧑‍💻</span>
              <h2 className="font-display mt-4 text-xl font-bold text-ink-900 dark:text-white">
                Link your LeetCode username
              </h2>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
                We&apos;ll fetch your profile, solved counts, submissions and contest stats.
              </p>
            </div>
            <LeetCodeConnectForm onSubmit={handleConnect} loading={loading} />
          </div>
        </div>
      )}
    </div>
  )
}

export default LeetCodeConnect
