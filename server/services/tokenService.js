import jwt from 'jsonwebtoken'
import { env, isProduction } from '../config/env.js'

export const signToken = (payload) =>
  jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpire,
  })

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret)

// Create and set the JWT in a secure HttpOnly cookie.
export const setAuthCookie = (res, userId) => {
  const token = signToken({ id: userId })

  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  }

  res.cookie('token', token, cookieOptions)
  return token
}

export const clearAuthCookie = (res) => {
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
  }
  res.clearCookie('token', cookieOptions)
}
