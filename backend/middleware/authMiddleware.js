const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        message: 'Authentication token is required'
      })
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader

    console.log('AUTH: token received')

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'career-guide-secret'
    )

    console.log('AUTH: token verified')

    req.user = decoded

    next()
  } catch (error) {
    console.error('AUTH ERROR:', error.message)

    return res.status(401).json({
      message: 'Invalid or expired authentication token'
    })
  }
}

module.exports = authMiddleware