import express from 'express'
import jwt from 'jsonwebtoken'
import passport from '../services/googleStrategy.js'
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  logout,
  getMe,
} from '../controllers/authController.js'
import { registerSchema, loginSchema } from '../utils/validation/authSchemas.js'
import { validate } from '../middleware/validate.js'
import rateLimit from 'express-rate-limit'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: {
    message: 'Too many login attempts, please try again later',
  },
})

router.post('/register', validate(registerSchema), register)
router.post('/login', loginLimiter, validate(loginSchema), login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/logout', logout)
router.get('/me', authMiddleware, getMe)

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.redirect(`${process.env.FRONTEND_URL}/profile`)
  }
)

export default router
