const express = require('express')

const {
  getUserGrowthStatistics,
  getMostRecommendedCareers,
  getAssessmentCompletionRates,
  getStudentProgressReports
} = require('../controllers/analyticsController')

const router = express.Router()

router.get('/user-growth', getUserGrowthStatistics)

router.get('/recommended-careers', getMostRecommendedCareers)

router.get('/assessment-completion', getAssessmentCompletionRates)

router.get('/student-progress', getStudentProgressReports)

module.exports = router