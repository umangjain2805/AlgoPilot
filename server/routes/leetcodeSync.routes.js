import { Router } from 'express'
import { syncLeetcode } from '../controllers/leetcodeSync.controller.js'

const router = Router()

// @route   POST /sync-leetcode
// @desc    Fetch and sync solved question IDs for a user into MongoDB
router.post('/sync-leetcode', syncLeetcode)

export default router
