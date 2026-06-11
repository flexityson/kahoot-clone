const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { env } = require('../config/env')

async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

function generateToken(userId, role) {
  return jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: '7d' })
}

function verifyToken(token) {
  try {
    return jwt.verify(token, env.JWT_SECRET)
  } catch {
    return null
  }
}

module.exports = { hashPassword, verifyPassword, generateToken, verifyToken }
