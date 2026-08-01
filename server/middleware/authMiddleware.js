import { verifyToken } from '../services/tokenService.js'
import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// Authentication — verifies the JWT cookie and attaches the user to req.user.
export const authenticate = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.token

  if (!token) {
    throw new ApiError(401, 'Not authenticated. Please log in to continue.')
  }

  const decoded = verifyToken(token)

  const user = await User.findById(decoded.id)
  if (!user) {
    throw new ApiError(401, 'User no longer exists. Please log in again.')
  }

  req.user = user
  next()
})

// Authorization — restricts routes to a set of allowed roles.
export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action'))
  }
  next()
}
