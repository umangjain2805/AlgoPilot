import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  connectLeetCodeProfile,
  getLeetCodeProfile,
  syncLeetCodeProfile,
  disconnectLeetCodeProfile,
} from '../services/leetcode/leetcodeService.js'

// @desc   Connect a LeetCode username and store the fetched profile
// @route  POST /api/leetcode/connect
export const connect = asyncHandler(async (req, res) => {
  const profile = await connectLeetCodeProfile(req.user.id, req.body.username)
  res.status(201).json(new ApiResponse(201, 'LeetCode profile connected successfully', { profile }))
})

// @desc   Get the stored LeetCode profile
// @route  GET /api/leetcode/profile
export const getProfile = asyncHandler(async (req, res) => {
  const profile = await getLeetCodeProfile(req.user.id)
  res.status(200).json(new ApiResponse(200, 'LeetCode profile fetched successfully', { profile }))
})

// @desc   Sync the latest LeetCode data
// @route  POST /api/leetcode/sync
export const sync = asyncHandler(async (req, res) => {
  const { profile, changedFields } = await syncLeetCodeProfile(req.user.id)
  res
    .status(200)
    .json(new ApiResponse(200, 'LeetCode profile synced successfully', { profile, changedFields }))
})

// @desc   Disconnect the linked LeetCode profile
// @route  DELETE /api/leetcode/disconnect
export const disconnect = asyncHandler(async (_req, res) => {
  await disconnectLeetCodeProfile(_req.user.id)
  res.status(200).json(new ApiResponse(200, 'LeetCode profile disconnected successfully'))
})
