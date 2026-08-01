export class ApiError extends Error {
  constructor(statusCode, message, errors = [], isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.success = false
    this.errors = errors
    this.isOperational = isOperational
    Error.captureStackTrace(this, this.constructor)
  }
}

export const createError = (statusCode, message, errors = []) =>
  new ApiError(statusCode, message, errors)
