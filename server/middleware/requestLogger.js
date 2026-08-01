import morgan from 'morgan'
import { isProduction } from '../config/env.js'

// Request logging — 'dev' format in development, 'combined' format in production.
export const requestLogger = morgan(isProduction ? 'combined' : 'dev')
