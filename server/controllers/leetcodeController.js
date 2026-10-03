import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { fetchLeetCodeProfile, validateUsername } from '../services/leetcode/leetcodeService.js'

// @desc   Fetch a LeetCode profile by username (public, no account required)
// @route  POST /api/leetcode/fetch
export const fetchProfile = asyncHandler(async (req, res) => {
  const username = validateUsername(req.body?.username)
  const profile = await fetchLeetCodeProfile(username)
  res.status(200).json(new ApiResponse(200, 'LeetCode profile fetched successfully', { profile }))
})
