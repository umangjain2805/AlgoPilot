import { OAuth2Client } from 'google-auth-library'
import { env } from '../config/env.js'

// Creates a Google OAuth2 client and verifies an ID token from the frontend.
export const verifyGoogleToken = async (idToken) => {
  if (!env.googleClientId) {
    throw new Error('Google OAuth is not configured')
  }

  const client = new OAuth2Client(env.googleClientId, env.googleClientSecret)

  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.googleClientId,
  })

  const payload = ticket.getPayload()

  if (!payload || !payload.email) {
    throw new Error('Invalid Google token payload')
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name || payload.email.split('@')[0],
    avatar: payload.picture || '',
    emailVerified: payload.email_verified || false,
  }
}
