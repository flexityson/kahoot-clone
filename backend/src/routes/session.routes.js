const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth.middleware')
const sessionController = require('../controllers/session.controller')

router.post('/', authMiddleware, sessionController.createSession)
router.get('/pin/:pin', sessionController.getSessionByPin)
router.get('/:id', sessionController.getSession)
router.get('/:id/leaderboard', sessionController.getLeaderboard)

module.exports = router