import mongoose from 'mongoose'
import { env } from './env.js'

// Connect to MongoDB with recommended production settings.
export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10000,
    })

    console.log(`[database] MongoDB connected: ${connection.connection.host}`)

    // Listen for connection errors after initial connect
    mongoose.connection.on('error', (err) => {
      console.error('[database] MongoDB connection error:', err)
    })

    return connection
  } catch (err) {
    console.error('[database] MongoDB connection failed:', err.message)
    throw err
  }
}
