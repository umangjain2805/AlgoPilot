import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { env } from './config/env.js'
import { requestLogger } from './middleware/requestLogger.js'
import { notFoundHandler } from './middleware/notFoundHandler.js'
import { errorMiddleware } from './middleware/errorMiddleware.js'
import leetcodeRoutes from './routes/leetcodeRoutes.js'
import leetcodeSyncRoutes from './routes/leetcodeSync.routes.js'

const app = express()

// ---- Security middleware ----
app.use(helmet())

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
)

// ---- Body parsing ----
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// ---- Request logging ----
app.use(requestLogger)

// ---- Rate limiting ----
const apiLimiter = rateLimit({
  windowMs: env.apiRateWindowMs,
  limit: env.apiRateLimit,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    data: null,
    error: null,
  },
})

app.use('/api', apiLimiter)

// ---- Health check ----
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'AI LeetCode Coach API is healthy',
    data: { status: 'ok', environment: env.nodeEnv },
    error: null,
  })
})

// ---- Routes ----
app.use('/sync-leetcode', apiLimiter)
app.use('/', leetcodeSyncRoutes) // compatibility route: no cookie-based writes
app.use('/api', leetcodeSyncRoutes) // POST /api/sync-leetcode
app.use('/api/leetcode', leetcodeRoutes)

// ---- 404 & error handling ----
app.use(notFoundHandler)
app.use(errorMiddleware)

export default app
