const authService = require('../services/auth.service')

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' })
    }

    const result = await authService.register(name, email, password, role)

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      ...result
    })
  } catch (error) {
    next(error)
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const result = await authService.login(email, password)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      ...result
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login }