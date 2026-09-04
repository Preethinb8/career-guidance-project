const express = require('express')
const {
  generateLearningPath
} = require('../controllers/learningPathController')

const router = express.Router()

router.post('/', generateLearningPath)

module.exports = router