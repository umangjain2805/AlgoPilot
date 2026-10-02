import app from './app.js'
import { env } from './config/env.js'
import { connectDB } from './config/db.js'
import { warmProblemCatalog } from './services/leetcode/client.js'

// Connect to MongoDB
connectDB().catch((err) => {
  console.warn(`[server] MongoDB connection warning: ${err.message}`)
})

const server = app.listen(env.port, () => {
  console.log(
    `[server] AI LeetCode Coach API running on http://localhost:${env.port} (${env.nodeEnv})`,
  )
})

// Preload the LeetCode problem catalog in the background so the first profile
// fetch can compute per-topic coverage without an on-request delay.
warmProblemCatalog()

// Graceful shutdown on SIGINT / SIGTERM
const shutdown = (signal) => {
  console.log(`[server] ${signal} received, shutting down gracefully...`)
  server.close(() => {
    console.log('[server] HTTP server closed')
    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled promise rejection:', reason)
  server.close(() => process.exit(1))
})
