import { body, validationResult } from 'express-validator'
import { ApiError } from '../utils/ApiError.js'

// Runs validation rules and returns the first error as a 400 response.
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

const emailRule = body('email')
  .trim()
  .isEmail()
  .withMessage('Please provide a valid email address')
  .normalizeEmail()

const passwordRule = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .withMessage(
    'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  )

export const registerValidator = validate([
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  emailRule,
  passwordRule,
])

export const loginValidator = validate([
  emailRule,
  body('password').notEmpty().withMessage('Password is required'),
])

export const googleValidator = validate([
  body('idToken').notEmpty().withMessage('Google ID token is required'),
])

export const guestValidator = validate([
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
])
