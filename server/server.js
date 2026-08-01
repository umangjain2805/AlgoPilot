import app from './app.js'
import { env } from './config/env.js'
import { connectDB } from './config/database.js'

const startServer = async () => {
  try {
    await connectDB()

    const server = app.listen(env.port, () => {
      console.log(
        `[server] AI LeetCode Coach API running on http://localhost:${env.port} (${env.nodeEnv})`,
      )
    })

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
  } catch (err) {
    console.error('[server] Failed to start server:', err)
    process.exit(1)
  }
}

startServer()
