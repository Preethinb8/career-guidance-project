const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')
const assessmentRoutes = require('./routes/assessmentRoutes')
const recommendationRoutes = require('./routes/recommendationRoutes')
const skillRoutes = require('./routes/skillRoutes')
const aiRoutes = require('./routes/aiRoutes')
const skillGapRoutes = require('./routes/skillGapRoutes')
const learningPathRoutes = require('./routes/learningPathRoutes')
const roadmapRoutes = require('./routes/roadmapRoutes')
const chatbotRoutes = require('./routes/chatbotRoutes')
const progressRoutes = require('./routes/progressRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const adminRoutes = require('./routes/adminRoutes')

const authMiddleware = require('./middleware/authMiddleware')
const adminMiddleware = require('./middleware/adminMiddleware')

const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log('REQUEST:', req.method, req.originalUrl)
  next()
})

app.use('/api/auth', authRoutes)

app.use('/api/profile', authMiddleware, profileRoutes)
app.use('/api/assessment', authMiddleware, assessmentRoutes)
app.use('/api/recommendations', authMiddleware, recommendationRoutes)
app.use('/api/skills', authMiddleware, skillRoutes)
app.use('/api/ai', authMiddleware, aiRoutes)
app.use('/api/skill-gap', authMiddleware, skillGapRoutes)
app.use('/api/learning-path', authMiddleware, learningPathRoutes)
app.use('/api/roadmap', authMiddleware, roadmapRoutes)
app.use('/api/chatbot', authMiddleware, chatbotRoutes)
app.use('/api/progress', authMiddleware, progressRoutes)
app.use('/api/analytics', authMiddleware, analyticsRoutes)

app.use('/api/admin', authMiddleware, adminMiddleware, adminRoutes)

app.get('/', (req, res) => {
  res.json({
    message: 'CareerGuide AI Backend is running!'
  })
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully')

    const PORT = process.env.PORT || 5000

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`CareerGuide AI Backend running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error(
      'MongoDB connection failed:',
      error.message
    )
  })