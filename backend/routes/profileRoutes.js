const express = require('express')
const Profile = require('../models/Profile')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// Save / update profile
router.post('/', authMiddleware, async (req, res) => {
  console.log('POST /api/profile reached')
  console.log('Profile data:', req.body)

  try {
    const {
      phone,
      education,
      careerInterests,
      technicalSkills,
      softSkills,
      preferredIndustries
    } = req.body

    const userId = req.user.id || req.user.userId

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required'
      })
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      {
        userId,
        phone,
        education,
        careerInterests,
        technicalSkills,
        softSkills,
        preferredIndustries
      },
      {
        new: true,
        upsert: true
      }
    )

    res.status(200).json({
      message: 'Profile saved successfully',
      profile
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to save profile'
    })
  }
})

// Get logged-in user's profile
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user.id || req.user.userId

    if (loggedInUserId !== req.params.userId) {
      return res.status(403).json({
        message: 'Access denied'
      })
    }

    const profile = await Profile.findOne({
      userId: req.params.userId
    })

    if (!profile) {
      return res.status(404).json({
        message: 'Profile not found'
      })
    }

    res.status(200).json(profile)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to get profile'
    })
  }
})

console.log('Profile routes loaded')

module.exports = router