const express = require('express')
const Assessment = require('../models/Assessment')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    // Get logged-in user ID from verified JWT
    const loggedInUserId = req.user.id || req.user.userId

    // Prevent one user from viewing another user's recommendations
    if (loggedInUserId !== req.params.userId) {
      return res.status(403).json({
        message: 'Access denied'
      })
    }

    const assessment = await Assessment.findOne({
      userId: req.params.userId
    }).sort({ createdAt: -1 })

    console.log(
      'LATEST ASSESSMENT:',
      JSON.stringify(assessment, null, 2)
    )

    if (!assessment) {
      return res.status(404).json({
        message: 'Assessment not found'
      })
    }

    const scores = {
      'Software Developer': 0,
      'Data Analyst': 0,
      'UI/UX Designer': 0,
      'Digital Marketer': 0,
      'Business Analyst': 0,
      'Cybersecurity Analyst': 0,
      'AI/ML Engineer': 0
    }

    assessment.answers.forEach((item) => {
      const answer = String(item.answer || '').toLowerCase()

      // 1. Activity
      if (item.question === 'Which type of activity do you enjoy most?') {
        if (answer.includes('analyzing')) {
          scores['Data Analyst'] += 2
          scores['Business Analyst'] += 2
          scores['Software Developer'] += 1
        }

        if (answer.includes('managing')) {
          scores['Business Analyst'] += 2
          scores['Digital Marketer'] += 1
        }

        if (answer.includes('design')) {
          scores['UI/UX Designer'] += 2
        }

        if (
          answer.includes('coding') ||
          answer.includes('programming')
        ) {
          scores['Software Developer'] += 2
          scores['AI/ML Engineer'] += 1
        }
      }

      // 2. Skill
      if (item.question === 'Which skill do you enjoy using the most?') {
        if (answer.includes('communication')) {
          scores['Digital Marketer'] += 2
          scores['Business Analyst'] += 1
        }

        if (
          answer.includes('mathematics') ||
          answer.includes('math')
        ) {
          scores['Data Analyst'] += 2
          scores['AI/ML Engineer'] += 1
        }

        if (
          answer.includes('programming') ||
          answer.includes('coding')
        ) {
          scores['Software Developer'] += 2
          scores['AI/ML Engineer'] += 1
        }

        if (answer.includes('design')) {
          scores['UI/UX Designer'] += 2
        }
      }

      // 3. Type of work
      if (item.question === 'Which type of work interests you most?') {
        if (answer.includes('data')) {
          scores['Data Analyst'] += 2
          scores['AI/ML Engineer'] += 1
          scores['Business Analyst'] += 1
        }

        if (answer.includes('software')) {
          scores['Software Developer'] += 2
        }

        if (answer.includes('design')) {
          scores['UI/UX Designer'] += 2
        }

        if (answer.includes('marketing')) {
          scores['Digital Marketer'] += 2
        }

        if (answer.includes('security')) {
          scores['Cybersecurity Analyst'] += 2
        }
      }

      // 4. Subject
      if (item.question === 'Which subject do you prefer?') {
        if (
          answer.includes('mathematics') ||
          answer.includes('math')
        ) {
          scores['Data Analyst'] += 2
          scores['AI/ML Engineer'] += 1
          scores['Software Developer'] += 1
        }

        if (
          answer.includes('art') ||
          answer.includes('design')
        ) {
          scores['UI/UX Designer'] += 2
        }

        if (answer.includes('computer')) {
          scores['Software Developer'] += 2
          scores['Cybersecurity Analyst'] += 1
        }

        if (answer.includes('business')) {
          scores['Business Analyst'] += 2
        }
      }

      // 5. Problem solving
      if (
        item.question ===
        'What kind of problem do you enjoy solving?'
      ) {
        if (answer.includes('data')) {
          scores['Data Analyst'] += 2
          scores['Business Analyst'] += 1
          scores['AI/ML Engineer'] += 1
        }

        if (answer.includes('technical')) {
          scores['Software Developer'] += 2
        }

        if (answer.includes('security')) {
          scores['Cybersecurity Analyst'] += 2
        }

        if (answer.includes('design')) {
          scores['UI/UX Designer'] += 2
        }

        if (answer.includes('business')) {
          scores['Business Analyst'] += 2
        }
      }

      // 6. Work environment
      if (
        item.question ===
        'Which work environment do you prefer?'
      ) {
        if (
          answer.includes('research') ||
          answer.includes('analytics')
        ) {
          scores['Data Analyst'] += 2
          scores['AI/ML Engineer'] += 1
        }

        if (
          answer.includes('development') ||
          answer.includes('software')
        ) {
          scores['Software Developer'] += 2
        }

        if (
          answer.includes('creative') ||
          answer.includes('design')
        ) {
          scores['UI/UX Designer'] += 2
        }

        if (answer.includes('business')) {
          scores['Business Analyst'] += 2
        }

        if (answer.includes('security')) {
          scores['Cybersecurity Analyst'] += 2
        }

        if (answer.includes('marketing')) {
          scores['Digital Marketer'] += 2
        }
      }

      // 7. Interesting activity
      if (
        item.question ===
        'Which activity sounds most interesting?'
      ) {
        if (
          answer.includes('pattern') ||
          answer.includes('data')
        ) {
          scores['Data Analyst'] += 2
          scores['AI/ML Engineer'] += 1
        }

        if (answer.includes('project')) {
          scores['Business Analyst'] += 2
        }

        if (answer.includes('design')) {
          scores['UI/UX Designer'] += 2
        }

        if (answer.includes('marketing')) {
          scores['Digital Marketer'] += 2
        }

        if (
          answer.includes('coding') ||
          answer.includes('software')
        ) {
          scores['Software Developer'] += 2
        }

        if (answer.includes('security')) {
          scores['Cybersecurity Analyst'] += 2
        }
      }

      // 8. Strength
      if (
        item.question ===
        'Which strength describes you best?'
      ) {
        if (answer.includes('analytical')) {
          scores['Data Analyst'] += 2
          scores['Business Analyst'] += 1
          scores['Software Developer'] += 1
          scores['AI/ML Engineer'] += 1
        }

        if (answer.includes('creative')) {
          scores['UI/UX Designer'] += 2
          scores['Digital Marketer'] += 1
        }

        if (answer.includes('communication')) {
          scores['Digital Marketer'] += 2
          scores['Business Analyst'] += 1
        }

        if (answer.includes('technical')) {
          scores['Software Developer'] += 2
          scores['Cybersecurity Analyst'] += 1
        }

        if (answer.includes('leadership')) {
          scores['Business Analyst'] += 2
          scores['Digital Marketer'] += 1
        }
      }
    })

    // Personality bonus
    const personalityType = assessment.personalityType

    if (personalityType === 'Creative') {
      scores['UI/UX Designer'] += 2
      scores['Digital Marketer'] += 1
    }

    if (personalityType === 'Analytical') {
      scores['Data Analyst'] += 2
      scores['Business Analyst'] += 1
      scores['AI/ML Engineer'] += 1
    }

    if (personalityType === 'Logical') {
      scores['Software Developer'] += 2
      scores['Cybersecurity Analyst'] += 1
      scores['AI/ML Engineer'] += 1
    }

    if (personalityType === 'Leadership') {
      scores['Business Analyst'] += 2
      scores['Digital Marketer'] += 1
    }

    const recommendations = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([career, score]) => ({
        career,
        score
      }))

    console.log('FINAL SCORES:', scores)

    res.status(200).json({
      message: 'Career recommendations generated successfully',
      personalityType,
      recommendations
    })
  } catch (error) {
    console.error('Recommendation error:', error)

    res.status(500).json({
      message: 'Failed to generate recommendations'
    })
  }
})

console.log('Recommendation routes loaded')

module.exports = router