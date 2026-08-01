import { body, validationResult } from 'express-validator'
import { ApiError } from '../utils/ApiError.js'

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/

export const validate = (rules) => [
  ...rules,
  (req, _res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const first = errors.array()[0]
      return next(new ApiError(400, first.msg, errors.array()))
    }
    next()
  },
]

export const connectValidator = validate([
  body('username')
    .trim()
    .notEmpty()
    .withMessage('LeetCode username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('LeetCode username must be between 3 and 30 characters')
    .matches(USERNAME_REGEX)
    .withMessage('LeetCode username can only contain letters, numbers, underscores and hyphens'),
])
