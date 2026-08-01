import { LeetCodeProfile } from '../../models/LeetCodeProfile.js'
import { ApiError } from '../../utils/ApiError.js'
import { leetcodeRequest } from './client.js'
import { USER_PROFILE_QUERY, CONTEST_RANKING_QUERY, RECENT_SUBMISSIONS_QUERY } from './queries.js'
import { normalizeProfile } from './normalizer.js'

const RECENT_SUBMISSIONS_LIMIT = 10

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/

export const validateUsername = (username) => {
  const trimmed = username?.trim()

  if (!trimmed) {
    throw new ApiError(400, 'LeetCode username is required')
  }
  if (trimmed.length < 3 || trimmed.length > 30) {
    throw new ApiError(400, 'LeetCode username must be between 3 and 30 characters')
  }
  if (!USERNAME_REGEX.test(trimmed)) {
    throw new ApiError(
      400,
      'LeetCode username can only contain letters, numbers, underscores and hyphens',
    )
  }

  return trimmed
}

// Fetches and normalizes the public LeetCode data for a username.
export const fetchLeetCodeProfile = async (username) => {
  const year = new Date().getFullYear()

  const [profileData, contestData, recentData] = await Promise.all([
    leetcodeRequest(
      USER_PROFILE_QUERY,
      { username, year },
      username,
    ),
    leetcodeRequest(CONTEST_RANKING_QUERY, { username }, username),
    leetcodeRequest(RECENT_SUBMISSIONS_QUERY, { username, limit: RECENT_SUBMISSIONS_LIMIT }, username),
  ])

  const matchedUser = profileData.matchedUser
  if (!matchedUser) {
    throw new ApiError(404, `LeetCode user "${username}" was not found`)
  }

  return normalizeProfile({
    matchedUser,
    contestRanking: contestData.userContestRanking,
    recentSubmissions: recentData.recentSubmissionList,
  })
}

// Connects a LeetCode username to the user and stores the fetched profile.
export const connectLeetCodeProfile = async (userId, usernameInput) => {
  const username = validateUsername(usernameInput)

  const existing = await LeetCodeProfile.findOne({ userId })
  if (existing) {
    throw new ApiError(409, 'A LeetCode profile is already connected. Use Sync to refresh it.')
  }

  const data = await fetchLeetCodeProfile(username)

  const profile = await LeetCodeProfile.create({
    userId,
    ...data,
    lastSyncedAt: new Date(),
  })

  return profile
}

// Returns the stored profile for a user.
export const getLeetCodeProfile = async (userId) => {
  const profile = await LeetCodeProfile.findOne({ userId })
  if (!profile) {
    throw new ApiError(404, 'No LeetCode profile is connected yet')
  }
  return profile
}

// Refetches the latest LeetCode data and updates only the changed fields.
export const syncLeetCodeProfile = async (userId) => {
  const existing = await LeetCodeProfile.findOne({ userId })
  if (!existing) {
    throw new ApiError(404, 'No LeetCode profile is connected yet')
  }

  const latest = await fetchLeetCodeProfile(existing.leetcodeUsername)

  let changedFields = 0
  for (const [key, value] of Object.entries(latest)) {
    const previous = existing[key]
    if (JSON.stringify(previous) !== JSON.stringify(value)) {
      existing[key] = value
      changedFields += 1
    }
  }

  existing.lastSyncedAt = new Date()
  await existing.save()

  return { profile: existing, changedFields }
}

// Removes the stored profile for a user.
export const disconnectLeetCodeProfile = async (userId) => {
  const deleted = await LeetCodeProfile.findOneAndDelete({ userId })
  if (!deleted) {
    throw new ApiError(404, 'No LeetCode profile is connected yet')
  }
  return true
}
