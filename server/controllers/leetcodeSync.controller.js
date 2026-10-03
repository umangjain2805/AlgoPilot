import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { fetchLeetCodeProfile, validateUsername } from '../services/leetcode/leetcodeService.js'

/**
 * @desc    Read-only public profile sync; session cookies and database writes are not supported
 * @route   POST /sync-leetcode
 * @access  Public
 */
export const syncLeetcode = asyncHandler(async (req, res) => {
  if (Object.hasOwn(req.body || {}, 'sessionCookie')) {
    throw new ApiError(
      400,
      'Session cookies are not accepted. Use public profile sync or import solved question IDs in the dashboard.',
    )
  }
  const username = validateUsername(req.body?.username)
  const profile = await fetchLeetCodeProfile(username)
  return res.status(200).json(
    new ApiResponse(200, 'Public profile synchronized. Solved history may be partial.', {
      username: profile.leetcodeUsername,
      totalSolvedCount: profile.totalSolved,
      profile,
    }),
  )
})
