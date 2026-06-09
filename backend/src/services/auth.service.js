const prisma = require('../config/database')
const bcrypt = require('bcryptjs')
const { generateToken } = require('../utils/jwtHelper')

async function register(name, email, password, role = 'STUDENT') {
  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    throw new Error('Email already registered')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role }
  })

  const token = generateToken(user.id, user.role)

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token
  }
}

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw new Error('Invalid email or password')
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    throw new Error('Invalid email or password')
  }

  const token = generateToken(user.id, user.role)

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token
  }
}

module.exports = { register, login }