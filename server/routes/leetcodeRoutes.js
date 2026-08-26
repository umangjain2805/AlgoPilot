import { Router } from 'express'
import { fetchProfile } from '../controllers/leetcodeController.js'

const router = Router()

// Public — fetches a profile by username without requiring an account.
// Used by anonymous ("local mode") sessions whose data lives in localStorage.
router.post('/fetch', fetchProfile)

export default router
