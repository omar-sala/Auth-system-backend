import express from 'express'
import bcrypt from 'bcrypt'
import { authMiddleware } from '../middleware/authMiddleware.js'
import prisma from '../config/prisma.js'

const router = express.Router()

// Get profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        googleId: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    return res.json({
      user,
    })
  } catch {
    return res.status(500).json({
      message: 'Something went wrong',
    })
  }
})

// Update profile
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Name is required',
      })
    }

    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        name: name.trim(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        googleId: true,
        createdAt: true,
      },
    })

    return res.json({
      message: 'Profile updated successfully',
      user,
    })
  } catch {
    return res.status(500).json({
      message: 'Something went wrong',
    })
  }
})

// Change password
router.patch('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'All fields are required',
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters',
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    })

    if (!user || !user.password) {
      return res.status(400).json({
        message: 'Password change is not available for this account',
      })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if (!isMatch) {
      return res.status(401).json({
        message: 'Current password is incorrect',
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        password: hashedPassword,
      },
    })

    return res.json({
      message: 'Password changed successfully',
    })
  } catch {
    return res.status(500).json({
      message: 'Something went wrong',
    })
  }
})

// Delete account
router.delete('/account', authMiddleware, async (req, res) => {
  try {
    const { password } = req.body

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    })

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (user.password) {
      if (!password) {
        return res.status(400).json({
          message: 'Password is required',
        })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(401).json({
          message: 'Incorrect password',
        })
      }
    }

    await prisma.user.delete({
      where: {
        id: req.user.id,
      },
    })

    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    })

    return res.json({
      message: 'Account deleted successfully',
    })
  } catch {
    return res.status(500).json({
      message: 'Something went wrong',
    })
  }
})

export default router
