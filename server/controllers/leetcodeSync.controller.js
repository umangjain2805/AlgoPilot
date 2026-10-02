import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { syncUserSolvedProblems } from '../services/leetcodeSync.service.js'

/**
 * @desc    Synchronize user's solved LeetCode problem numbers into MongoDB
 * @route   POST /sync-leetcode
 * @access  Public / Authenticated
 */
export const syncLeetcode = asyncHandler(async (req, res) => {
  const { username, sessionCookie } = req.body

  if (!username || typeof username !== 'string' || !username.trim()) {
    throw new ApiError(400, 'Username is required and must be a valid string')
  }

  // Trigger synchronization service
  const result = await syncUserSolvedProblems(username, { sessionCookie })

  // Return formatted response with total solved count
  return res.status(200).json(
    new ApiResponse(200, 'LeetCode solved problems synchronized successfully', {
      username: result.userId,
      totalSolvedCount: result.totalSolvedCount,
    }),
  )
})
