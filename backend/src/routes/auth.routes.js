const express = require('express')
const router = express.Router()
const { z } = require('zod')
const { validate } = require('../middleware/validate.middleware')
const { authLimiter } = require('../middleware/rateLimit.middleware')
const authController = require('../controllers/auth.controller')

router.use(authLimiter)

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'TEACHER']).optional()
})

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)

module.exports = router