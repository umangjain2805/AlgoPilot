import { ApiError } from '../utils/ApiError.js'

// 404 handler for unmatched routes.
export const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`))
}
