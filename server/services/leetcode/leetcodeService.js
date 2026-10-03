import { ApiError } from '../../utils/ApiError.js'
import { env } from '../../config/env.js'
import { leetcodeRequest, fetchAcSubmissionSlugs, fetchSkillStats } from './client.js'
import { USER_PROFILE_QUERY, CONTEST_RANKING_QUERY, RECENT_SUBMISSIONS_QUERY } from './queries.js'
import { normalizeProfile, uniqueSlugs } from './normalizer.js'

const cache = new Map()
const pending = new Map()

export const validateUsername = (username) => {
  if (typeof username !== 'string' || !username.trim()) {
    throw new ApiError(400, 'LeetCode username is required and must be a string')
  }
  const trimmed = username.trim()
  if (trimmed.length > 30 || !/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    throw new ApiError(
      400,
      'Use a LeetCode username of up to 30 letters, numbers, underscores or hyphens',
    )
  }
  return trimmed
}

const loadProfile = async (username) => {
  const profileData = await leetcodeRequest(
    USER_PROFILE_QUERY,
    { username, year: new Date().getFullYear() },
    username,
  )
  if (!profileData.matchedUser) throw new ApiError(404, `LeetCode user "${username}" was not found`)
  const solvedCount = profileData.matchedUser.submitStats?.acSubmissionNum?.find(
    (item) => item.difficulty === 'All',
  )?.count
  if (!Number.isInteger(solvedCount) || solvedCount < 0) {
    throw new ApiError(
      502,
      'LeetCode returned incomplete solve counts. Your saved profile is still available.',
    )
  }

  const results = await Promise.allSettled([
    leetcodeRequest(CONTEST_RANKING_QUERY, { username }, username),
    leetcodeRequest(RECENT_SUBMISSIONS_QUERY, { username, limit: 20 }, username),
    fetchAcSubmissionSlugs(username),
    fetchSkillStats(username),
  ])
  const [contest, recent, accepted, skills] = results.map((result) =>
    result.status === 'fulfilled' ? result.value : null,
  )
  const warnings = []
  if (!contest) warnings.push('Contest information is temporarily unavailable.')
  if (!recent) warnings.push('Recent activity is temporarily unavailable.')
  if (!accepted)
    warnings.push(
      'Accepted submission history is unavailable; new-question status cannot be verified.',
    )
  if (!skills) warnings.push('Public topic counts are temporarily unavailable.')
  const profile = normalizeProfile({
    matchedUser: profileData.matchedUser,
    contestRanking: contest?.userContestRanking,
    recentSubmissions: recent?.recentSubmissionList,
  })
  const solvedSlugs = uniqueSlugs([
    ...(accepted || []),
    ...profile.recentSubmissions
      .filter((s) => s.statusDisplay === 'Accepted')
      .map((s) => s.titleSlug),
  ])
  const solvedTopicStats = ['fundamental', 'intermediate', 'advanced'].flatMap((tier) =>
    (skills?.[tier] || []).map((item) => ({
      name: item.tagName,
      solved: Number(item.problemsSolved) || 0,
      total: null,
      ratio: null,
    })),
  )
  return {
    ...profile,
    solvedSlugs,
    solvedTopicStats,
    history: {
      status:
        (profile.totalSolved === 0 && solvedSlugs.length === 0) ||
        (accepted && solvedSlugs.length === profile.totalSolved)
          ? 'complete'
          : accepted
            ? 'partial'
            : 'unavailable',
      knownSolvedCount: solvedSlugs.length,
      totalSolvedCount: profile.totalSolved,
      source: 'public-recent-submissions',
    },
    warnings,
    fetchedAt: Date.now(),
  }
}

export const fetchLeetCodeProfile = async (input) => {
  const username = validateUsername(input)
  const key = username.toLowerCase()
  const cached = cache.get(key)
  if (cached && Date.now() - cached.fetchedAt < env.profileCacheTtlMs) return cached
  if (pending.has(key)) return pending.get(key)
  const promise = loadProfile(username)
    .then((profile) => {
      cache.delete(key)
      cache.set(key, profile)
      while (cache.size > env.profileCacheMaxEntries) cache.delete(cache.keys().next().value)
      return profile
    })
    .finally(() => pending.delete(key))
  pending.set(key, promise)
  return promise
}
