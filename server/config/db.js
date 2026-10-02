import mongoose from 'mongoose'
import { env } from './env.js'

let isConnected = false

export const connectDB = async () => {
  if (isConnected) {
    return
  }

  try {
    const conn = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    })

    isConnected = true
    console.log(`[database] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`)
  } catch (error) {
    console.error(`[database] MongoDB connection error: ${error.message}`)
    // In production microservices, decide whether to exit process or retry
    throw error
  }
}
