import { ApiError } from '../utils/ApiError.js'
import { isProduction } from '../config/env.js'

// Global error handling middleware — must be registered last in the middleware chain.
export const errorMiddleware = (err, req, res, _next) => {
  let error = err

  // Mongoose validation errors -> 400
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    error = new ApiError(400, messages[0], messages)
  }

  // Mongoose duplicate key error -> 409
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    error = new ApiError(409, `${field} already exists`)
  }

  // Mongoose CastError (invalid ObjectId etc.) -> 404
  if (err.name === 'CastError') {
    error = new ApiError(404, `Invalid ${err.path}`)
  }

  // JsonWebToken errors -> 401
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token. Please log in again.')
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Your session has expired. Please log in again.')
  }

  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal Server Error'

  if (statusCode === 500) {
    console.error('Unhandled error:', err)
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    error: {
      errors: error.errors || [],
      stack: !isProduction && error.stack ? error.stack : undefined,
    },
  })
}
