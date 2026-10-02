import { ApiError } from '../utils/ApiError.js'
import { SolvedProblem } from '../models/solvedProblem.model.js'

const LEETCODE_PROBLEMS_ENDPOINT = 'https://leetcode.com/api/problems/all/'
const REQUEST_TIMEOUT_MS = 15000

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

/**
 * Fetches the problemset data from LeetCode's legacy endpoint.
 *
 * @param {string} [sessionCookie] Optional LEETCODE_SESSION cookie.
 *   Note: LeetCode's /api/problems/all/ returns status="ac" only when
 *   an authenticated session cookie is present on the request.
 * @returns {Promise<Array<object>>} Raw stat_status_pairs array
 */
export const fetchLeetCodeProblemList = async (sessionCookie = null) => {
  const headers = {
    'User-Agent': USER_AGENT,
    Accept: 'application/json, text/plain, */*',
    Referer: 'https://leetcode.com/problems/all-problem-list/',
  }

  if (sessionCookie) {
    headers['Cookie'] = `LEETCODE_SESSION=${sessionCookie}`
  }

  let response
  try {
    response = await fetch(LEETCODE_PROBLEMS_ENDPOINT, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch (err) {
    if (err.name === 'TimeoutError') {
      throw new ApiError(504, 'LeetCode API request timed out after 15 seconds')
    }
    throw new ApiError(502, `Failed to reach LeetCode API: ${err.message}`)
  }

  if (!response.ok) {
    throw new ApiError(
      response.status === 429 ? 429 : 502,
      `LeetCode API returned status ${response.status}: ${response.statusText}`,
    )
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new ApiError(502, 'Malformed JSON payload received from LeetCode')
  }

  if (!Array.isArray(data?.stat_status_pairs)) {
    throw new ApiError(502, 'Unexpected response format: "stat_status_pairs" array missing')
  }

  return data.stat_status_pairs
}

/**
 * Extracts frontend_question_id for solved problems (status === "ac").
 * Optimized for performance: O(N) single-pass iteration, O(1) Set deduplication,
 * immediately discards extraneous metadata to minimize heap pressure.
 *
 * @param {Array<object>} statStatusPairs
 * @returns {Array<number>} Deduplicated list of solved question numbers sorted ascending
 */
export const extractSolvedQuestionIds = (statStatusPairs) => {
  if (!Array.isArray(statStatusPairs)) {
    return []
  }

  const seen = new Set()
  const questionIds = []

  for (let i = 0; i < statStatusPairs.length; i += 1) {
    const item = statStatusPairs[i]

    // Requirement: Filter only solved problems where status = "ac"
    // Requirement: Extract only "frontend_question_id"
    if (item?.status === 'ac' && item.stat?.frontend_question_id != null) {
      const qId = Number(item.stat.frontend_question_id)

      // Ensure valid integer and ignore duplicates in memory
      if (Number.isInteger(qId) && !seen.has(qId)) {
        seen.add(qId)
        questionIds.push(qId)
      }
    }
  }

  // Sort ascending for predictable indexing and array comparisons
  return questionIds.sort((a, b) => a - b)
}

/**
 * Synchronizes solved question numbers for a given user in MongoDB.
 * Uses atomic upsert with $addToSet to avoid duplicates and race conditions.
 *
 * @param {string} userId User identifier (username or user account ID)
 * @param {object} [options]
 * @param {string} [options.sessionCookie] Optional session cookie
 * @returns {Promise<{ userId: string, totalSolvedCount: number, newlySyncedCount: number }>}
 */
export const syncUserSolvedProblems = async (userId, options = {}) => {
  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    throw new ApiError(400, 'Valid userId or username is required')
  }

  const normalizedUserId = userId.trim()

  // 1. Fetch raw problems from LeetCode endpoint
  const rawPairs = await fetchLeetCodeProblemList(options.sessionCookie)

  // 2. Extract & deduplicate solved frontend_question_id numbers
  const solvedQuestionIds = extractSolvedQuestionIds(rawPairs)

  // 3. Atomically upsert into MongoDB with $addToSet to avoid duplicates
  // Using $addToSet guarantees idempotent updates without race conditions
  const updatedRecord = await SolvedProblem.findOneAndUpdate(
    { userId: normalizedUserId },
    {
      $addToSet: {
        questionIds: { $each: solvedQuestionIds },
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  )

  const totalSolvedCount = updatedRecord.questionIds.length

  return {
    userId: normalizedUserId,
    totalSolvedCount,
    syncedFromApiCount: solvedQuestionIds.length,
  }
}
