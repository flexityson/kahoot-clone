const jwt = require('jsonwebtoken')
const env = require('../config/env')

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)
    req.user = { id: decoded.userId, role: decoded.role }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = authMiddleware