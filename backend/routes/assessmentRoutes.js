const express = require('express')
const Assessment = require('../models/Assessment')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// Save assessment
router.post('/', authMiddleware, async (req, res) => {
  console.log('POST /api/assessment reached')
  console.log('Assessment data:', req.body)

  try {
    const {
      answers,
      personalityType
    } = req.body

    const userId = req.user.id || req.user.userId

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required'
      })
    }

    if (!answers || answers.length === 0) {
      return res.status(400).json({
        message: 'Assessment answers are required'
      })
    }

    const assessment = await Assessment.create({
      userId,
      answers,
      personalityType
    })

    res.status(201).json({
      message: 'Assessment saved successfully',
      assessment
    })
  } catch (error) {
    console.error('Assessment save error:', error)

    res.status(500).json({
      message: 'Failed to save assessment'
    })
  }
})

// Get logged-in user's latest assessment
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user.id || req.user.userId

    if (loggedInUserId !== req.params.userId) {
      return res.status(403).json({
        message: 'Access denied'
      })
    }

    const assessment = await Assessment.findOne({
      userId: req.params.userId
    }).sort({ createdAt: -1 })

    if (!assessment) {
      return res.status(404).json({
        message: 'Assessment not found'
      })
    }

    res.status(200).json(assessment)
  } catch (error) {
    console.error('Assessment fetch error:', error)

    res.status(500).json({
      message: 'Failed to get assessment'
    })
  }
})

console.log('Assessment routes loaded')

module.exports = router