import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.js'
import { sendResetEmail } from '../services/emailService.js'

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields required',
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return res.status(201).json({
      message: 'User created',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong',
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    // console.log('LOGIN EMAIL:', email)
    // console.log('USER FOUND:', !!user)
    // console.log('PASSWORD RECEIVED:', !!password)

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    console.log('PASSWORD MATCH:', isMatch)

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    // console.log('TOKEN COOKIE SET')

    return res.json({
      message: 'Login successful',
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong',
    })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(200).json({
        message: 'If this email exists, a reset link has been sent',
      })
    }

    const resetToken = randomBytes(32).toString('hex')

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
      },
    })

    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt,
      },
    })

    await sendResetEmail(user.email, resetToken)

    return res.status(200).json({
      message: 'If this email exists, a reset link has been sent',
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Something went wrong',
    })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({
        message: 'Token and password are required',
      })
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken) {
      return res.status(400).json({
        message: 'Invalid or expired reset token',
      })
    }

    if (resetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      })

      return res.status(400).json({
        message: 'Invalid or expired reset token',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: {
        password: hashedPassword,
      },
    })

    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    })

    return res.status(200).json({
      message: 'Password reset successfully',
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Something went wrong',
    })
  }
}

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  })

  return res.json({
    message: 'Logout successful',
  })
}

export const getMe = async (req, res) => {
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
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Something went wrong',
    })
  }
}
