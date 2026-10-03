import { Router } from 'express'
import { syncLeetcode } from '../controllers/leetcodeSync.controller.js'

const router = Router()

// @route   POST /sync-leetcode
// @desc    Compatibility endpoint for read-only public profile sync
router.post('/sync-leetcode', syncLeetcode)

export default router
