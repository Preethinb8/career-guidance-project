const express = require('express')
const SkillAssessment = require('../models/SkillAssessment')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// Save / update skill assessment
router.post('/', authMiddleware, async (req, res) => {
  console.log('POST /api/skills reached')
  console.log('Skill data:', req.body)

  try {
    const {
      technicalScore,
      aptitudeScore,
      communicationScore,
      totalScore
    } = req.body

    const userId = req.user.id || req.user.userId

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required'
      })
    }

    const skillAssessment =
      await SkillAssessment.findOneAndUpdate(
        { userId },
        {
          userId,
          technicalScore,
          aptitudeScore,
          communicationScore,
          totalScore
        },
        {
          new: true,
          upsert: true
        }
      )

    res.status(200).json({
      message: 'Skill assessment saved successfully',
      skillAssessment
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to save skill assessment'
    })
  }
})

// Get logged-in user's skill assessment
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user.id || req.user.userId

    if (loggedInUserId !== req.params.userId) {
      return res.status(403).json({
        message: 'Access denied'
      })
    }

    const skillAssessment =
      await SkillAssessment.findOne({
        userId: req.params.userId
      })

    if (!skillAssessment) {
      return res.status(404).json({
        message: 'Skill assessment not found'
      })
    }

    res.status(200).json(skillAssessment)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to get skill assessment'
    })
  }
})

console.log('Skill routes loaded')

module.exports = router