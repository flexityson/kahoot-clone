const sessionService = require('../services/session.service')
const prisma = require('../config/database')

async function createSession(req, res, next) {
  try {
    const { quizId } = req.body

    const session = await sessionService.createSession(quizId, req.user.id)

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      session
    })
  } catch (error) {
    next(error)
  }
}

async function getSessionByPin(req, res, next) {
  try {
    const session = await sessionService.getSessionByPin(req.params.pin)

    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    res.status(200).json({
      success: true,
      session
    })
  } catch (error) {
    next(error)
  }
}

async function getSession(req, res, next) {
  try {
    const session = await sessionService.getSessionById(req.params.id)

    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    res.status(200).json({
      success: true,
      session
    })
  } catch (error) {
    next(error)
  }
}

async function getLeaderboard(req, res, next) {
  try {
    const players = await prisma.player.findMany({
      where: { sessionId: req.params.id },
      orderBy: { totalScore: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })

    const leaderboard = players.map((p, index) => ({
      rank: index + 1,
      id: p.id,
      nickname: p.nickname,
      avatar: p.avatar,
      totalScore: p.totalScore,
      userId: p.userId
    }))

    res.status(200).json({
      success: true,
      leaderboard
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { createSession, getSessionByPin, getSession, getLeaderboard }