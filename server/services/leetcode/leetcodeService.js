import { ApiError } from '../../utils/ApiError.js'
import {
  leetcodeRequest,
  fetchAcSubmissionSlugs,
  fetchSkillStats,
  fetchProblemCatalog,
} from './client.js'
import { USER_PROFILE_QUERY, CONTEST_RANKING_QUERY, RECENT_SUBMISSIONS_QUERY } from './queries.js'
import { normalizeProfile, uniqueSlugs, buildTopicCoverage } from './normalizer.js'

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
// the full list of solved problem slugs from the public acSubmission endpoint
// and per-topic coverage computed against the full LeetCode problem catalog.
export const fetchLeetCodeProfile = async (username) => {
  const year = new Date().getFullYear()

  const [profileData, contestData, recentData, solvedSlugs, skillStats] = await Promise.all([
    leetcodeRequest(USER_PROFILE_QUERY, { username, year }, username),
    leetcodeRequest(CONTEST_RANKING_QUERY, { username }, username),
    leetcodeRequest(
      RECENT_SUBMISSIONS_QUERY,
      { username, limit: RECENT_SUBMISSIONS_LIMIT },
      username,
    ),
    fetchAcSubmissionSlugs(username),
    fetchSkillStats(username),
  ])

  const matchedUser = profileData.matchedUser
  if (!matchedUser) {
    throw new ApiError(404, `LeetCode user "${username}" was not found`)
  }

  const uniqueSolvedSlugs = uniqueSlugs(solvedSlugs)

  // The catalog fetch is best-effort: if LeetCode is unreachable or the catalog
  // is not yet cached, we fall back to no topic stats and the client uses its
  // bundled curated dataset instead.
  let solvedTopicStats
  try {
    const catalog = await fetchProblemCatalog()
    solvedTopicStats = buildTopicCoverage(uniqueSolvedSlugs, catalog, skillStats)
  } catch {
    solvedTopicStats = buildTopicCoverage(uniqueSolvedSlugs, [], skillStats)
  }

  return {
    ...normalizeProfile({
      matchedUser,
      contestRanking: contestData.userContestRanking,
      recentSubmissions: recentData.recentSubmissionList,
    }),
    solvedSlugs: uniqueSolvedSlugs,
    solvedTopicStats,
  }
}
