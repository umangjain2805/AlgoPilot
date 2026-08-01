import dotenv from 'dotenv'

dotenv.config()

const requiredVars = ['JWT_SECRET', 'COOKIE_SECRET']

const missing = requiredVars.filter((key) => !process.env[key])

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-leetcode-coach',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
}

export const isProduction = env.nodeEnv === 'production'
