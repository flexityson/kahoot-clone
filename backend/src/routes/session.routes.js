const express = require('express')
const router = express.Router()
const { z } = require('zod')
const authMiddleware = require('../middleware/auth.middleware')
const { validate } = require('../middleware/validate.middleware')
const sessionController = require('../controllers/session.controller')

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const createSessionSchema = z.object({
  quizId: z.string().regex(uuidRegex, 'Invalid quiz ID format')
})

const sessionIdSchema = z.object({
  id: z.string().regex(uuidRegex, 'Invalid session ID format')
})

const pinSchema = z.object({
  pin: z.string().regex(/^\d{6}$/, 'PIN must be exactly 6 digits')
})

router.post('/', authMiddleware, validate(createSessionSchema), sessionController.createSession)
router.get('/pin/:pin', validate(pinSchema), sessionController.getSessionByPin)
router.get('/:id', authMiddleware, validate(sessionIdSchema), sessionController.getSession)
router.get('/:id/leaderboard', authMiddleware, validate(sessionIdSchema), sessionController.getLeaderboard)

module.exports = router