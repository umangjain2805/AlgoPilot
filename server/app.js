import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { mongoSanitize } from './middleware/mongoSanitize.js'

import { env } from './config/env.js'
import { requestLogger } from './middleware/requestLogger.js'
import { notFoundHandler } from './middleware/notFoundHandler.js'
import { errorMiddleware } from './middleware/errorMiddleware.js'
import authRoutes from './routes/authRoutes.js'
import leetcodeRoutes from './routes/leetcodeRoutes.js'

const app = express()

// ---- Security middleware ----
app.use(helmet())

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
)

app.use(cookieParser(env.cookieSecret))

// ---- Body parsing ----
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// ---- NoSQL injection sanitization ----
app.use(mongoSanitize())

// ---- Request logging ----
app.use(requestLogger)

// ---- Rate limiting ----
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
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
app.use('/api/auth', authRoutes)
app.use('/api/leetcode', leetcodeRoutes)

// ---- 404 & error handling ----
app.use(notFoundHandler)
app.use(errorMiddleware)

export default app
