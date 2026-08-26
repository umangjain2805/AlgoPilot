import { ApiError } from '../../utils/ApiError.js'
import { leetcodeRequest, fetchAcSubmissionSlugs } from './client.js'
import { USER_PROFILE_QUERY, CONTEST_RANKING_QUERY, RECENT_SUBMISSIONS_QUERY } from './queries.js'
import { normalizeProfile, uniqueSlugs } from './normalizer.js'

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

// Fetches and normalizes the public LeetCode data for a username, including
// the full list of solved problem slugs from the public acSubmission endpoint.
export const fetchLeetCodeProfile = async (username) => {
  const year = new Date().getFullYear()

  const [profileData, contestData, recentData, solvedSlugs] = await Promise.all([
    leetcodeRequest(
      USER_PROFILE_QUERY,
      { username, year },
      username,
    ),
    leetcodeRequest(CONTEST_RANKING_QUERY, { username }, username),
    leetcodeRequest(RECENT_SUBMISSIONS_QUERY, { username, limit: RECENT_SUBMISSIONS_LIMIT }, username),
    fetchAcSubmissionSlugs(username),
  ])

  const matchedUser = profileData.matchedUser
  if (!matchedUser) {
    throw new ApiError(404, `LeetCode user "${username}" was not found`)
  }

  return {
    ...normalizeProfile({
      matchedUser,
      contestRanking: contestData.userContestRanking,
      recentSubmissions: recentData.recentSubmissionList,
    }),
    solvedSlugs: uniqueSlugs(solvedSlugs),
  }
}
