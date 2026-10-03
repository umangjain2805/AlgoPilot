import { ApiError } from '../../utils/ApiError.js'
import { env } from '../../config/env.js'
import { RECENT_AC_SUBMISSIONS_QUERY, SKILL_STATS_QUERY } from './queries.js'

export const leetcodeRequest = async (query, variables = {}, username = '') => {
  let response
  try {
    response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'LeetCode-Practice-Coach/1.0',
        Referer: `https://leetcode.com/u/${encodeURIComponent(username)}/`,
      },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(env.requestTimeoutMs),
    })
  } catch (error) {
    throw new ApiError(
      error.name === 'TimeoutError' ? 504 : 502,
      error.name === 'TimeoutError'
        ? 'LeetCode request timed out. Please try again.'
        : 'Unable to reach LeetCode. Please try again later.',
    )
  }
  if (!response.ok) {
    throw new ApiError(
      response.status === 429 ? 429 : 502,
      response.status === 429
        ? 'LeetCode is limiting requests. Wait a few minutes before refreshing.'
        : 'LeetCode is temporarily unavailable. Your saved progress is safe.',
    )
  }
  let payload
  try {
    payload = await response.json()
  } catch {
    throw new ApiError(502, 'Invalid response received from LeetCode.')
  }
  if (payload.errors?.length) {
    if (payload.errors.some((error) => /does not exist|not found/i.test(error.message || ''))) {
      throw new ApiError(404, 'This LeetCode username does not exist')
    }
    throw new ApiError(
      502,
      'LeetCode could not provide the requested data. Please try again later.',
    )
  }
  if (!payload.data || typeof payload.data !== 'object')
    throw new ApiError(502, 'LeetCode returned an incomplete response.')
  return payload.data
}

// Recent accepted submissions are a partial history, not an all-time export.
export const fetchAcSubmissionSlugs = async (username) => {
  const data = await leetcodeRequest(
    RECENT_AC_SUBMISSIONS_QUERY,
    { username, limit: 100 },
    username,
  )
  if (!Array.isArray(data.recentAcSubmissionList))
    throw new ApiError(502, 'Accepted history is unavailable.')
  return [...new Set(data.recentAcSubmissionList.map((item) => item.titleSlug).filter(Boolean))]
}

export const fetchSkillStats = async (username) => {
  const data = await leetcodeRequest(SKILL_STATS_QUERY, { username }, username)
  if (!data.matchedUser?.tagProblemCounts) throw new ApiError(502, 'Topic counts are unavailable.')
  return data.matchedUser.tagProblemCounts
}
