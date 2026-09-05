const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

console.log('AUTH ROUTES LOADED - FORGOT PASSWORD INCLUDED')

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please fill all fields'
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'Registration failed',
      error: error.message
    })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'career-guide-secret',
      {
        expiresIn: '1d'
      }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'Login failed',
      error: error.message
    })
  }
})

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    const resetToken = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET || 'career-guide-secret',
      {
        expiresIn: '15m'
      }
    )

    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000
    )

    await user.save()

    res.json({
      message: 'Password reset token generated successfully',
      resetToken
    })
  } catch (error) {
    res.status(500).json({
      message: 'Password reset failed',
      error: error.message
    })
  }
})

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({
        message: 'Token and new password are required'
      })
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    })

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired reset token'
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword
    user.resetPasswordToken = null
    user.resetPasswordExpires = null

    await user.save()

    res.json({
      message: 'Password reset successful'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Password reset failed',
      error: error.message
    })
  }
})

module.exports = router