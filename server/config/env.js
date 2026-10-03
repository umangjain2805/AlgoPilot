import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'

dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)), quiet: true })

const positiveInteger = (name, fallback, max = Number.MAX_SAFE_INTEGER) => {
  const value = Number(process.env[name] || fallback)
  if (!Number.isInteger(value) || value < 1 || value > max) {
    throw new Error(`${name} must be an integer between 1 and ${max}`)
  }
  return value
}

export const env = {
  port: positiveInteger('PORT', 5000, 65535),
  nodeEnv: process.env.SERVER_NODE_ENV || process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  requestTimeoutMs: positiveInteger('LEETCODE_REQUEST_TIMEOUT_MS', 15000, 60000),
  profileCacheTtlMs: positiveInteger('PROFILE_CACHE_TTL_MS', 300000),
  profileCacheMaxEntries: positiveInteger('PROFILE_CACHE_MAX_ENTRIES', 500),
  apiRateLimit: positiveInteger('API_RATE_LIMIT', 60),
  apiRateWindowMs: positiveInteger('API_RATE_WINDOW_MS', 900000),
}

export const isProduction = env.nodeEnv === 'production'
