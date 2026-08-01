import { Router } from 'express'
import {
  register,
  login,
  logout,
  getMe,
  googleLogin,
  guestLogin,
} from '../controllers/authController.js'
import {
  registerValidator,
  loginValidator,
  googleValidator,
  guestValidator,
} from '../validators/authValidator.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/register', registerValidator, register)
router.post('/login', loginValidator, login)
router.post('/logout', logout)
router.post('/google', googleValidator, googleLogin)
router.post('/guest', guestValidator, guestLogin)
router.get('/me', authenticate, getMe)

export default router
