import { Router } from 'express'
import { connect, getProfile, sync, disconnect } from '../controllers/leetcodeController.js'
import { connectValidator } from '../validators/leetcodeValidator.js'
import { authenticate, disallowGuest } from '../middleware/authMiddleware.js'

const router = Router()

// All LeetCode routes require an authenticated, non-guest user.
router.use(authenticate, disallowGuest)

router.post('/connect', connectValidator, connect)
router.get('/profile', getProfile)
router.post('/sync', sync)
router.delete('/disconnect', disconnect)

export default router
