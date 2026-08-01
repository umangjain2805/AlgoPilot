import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { setAuthCookie, clearAuthCookie } from '../services/tokenService.js'
import { verifyGoogleToken } from '../services/googleAuthService.js'

// @desc   Register a new local user
// @route  POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
    provider: 'local',
  })

  setAuthCookie(res, user.id)

  res.status(201).json(new ApiResponse(201, 'Account created successfully', { user }))
})

// @desc   Login a local user
// @route  POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password')
  }

  setAuthCookie(res, user.id)

  res.status(200).json(new ApiResponse(200, 'Logged in successfully', { user }))
})

// @desc   Logout current user
// @route  POST /api/auth/logout
export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res)
  res.status(200).json(new ApiResponse(200, 'Logged out successfully'))
})

// @desc   Get current authenticated user
// @route  GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  res.status(200).json(new ApiResponse(200, 'User fetched successfully', { user }))
})

// @desc   Google OAuth login (auto-registers new users)
// @route  POST /api/auth/google
export const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body

  const googleUser = await verifyGoogleToken(idToken)

  let user = await User.findOne({ email: googleUser.email })

  if (!user) {
    user = await User.create({
      name: googleUser.name,
      email: googleUser.email,
      avatar: googleUser.avatar,
      googleId: googleUser.googleId,
      provider: 'google',
    })
  } else if (user.googleId !== googleUser.googleId) {
    // Link the Google account if a user already exists with the same email.
    user.googleId = googleUser.googleId
    user.provider = 'google'
    user.avatar = user.avatar || googleUser.avatar
    await user.save()
  }

  setAuthCookie(res, user.id)

  res.status(200).json(new ApiResponse(200, 'Logged in with Google', { user }))
})

// @desc   Guest login (no password, limited access)
// @route  POST /api/auth/guest
export const guestLogin = asyncHandler(async (req, res) => {
  const { name } = req.body

  const guest = await User.create({
    name: name || 'Guest User',
    email: `guest-${Date.now()}@guest.ai-leetcode-coach.local`,
    isGuest: true,
    provider: 'local',
  })

  setAuthCookie(res, guest.id)

  res
    .status(200)
    .json(new ApiResponse(200, 'Continuing as guest', { user: guest, guestMode: true }))
})
