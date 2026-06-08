const { getIO } = require('../../config/socket')
const sessionService = require('../../services/session.service')
const prisma = require('../../config/database')

function initHostHandlers() {
  const io = getIO()

  // Host starts the game
  io.on('host:start_game', async ({ sessionId }, socket) => {
    try {
      const session = await sessionService.updateSessionStatus(sessionId, 'LIVE')

      socket.to(`session:${sessionId}`).emit('game:started', {
        quiz: session.quiz
      })

      socket.emit('host:game_started', {
        sessionId,
        playerCount: session.players?.length || 0
      })
    } catch (error) {
      console.error('Host start game error:', error)
      socket.emit('host:error', { message: 'Failed to start game' })
    }
  })

  // Host moves to next question
  io.on('host:next_question', async ({ sessionId }, socket) => {
    try {
      const session = await sessionService.incrementCurrentQuestion(sessionId)
      const currentQuestion = session.quiz.questions[session.currentQIndex]

      if (!currentQuestion) {
        io.to(`session:${sessionId}`).emit('game:ended')
        socket.emit('host:game_complete', { sessionId })
        return
      }

      // Send question to all players (without correct answer info)
      io.to(`session:${sessionId}`).emit('question:new', {
        question: {
          id: currentQuestion.id,
          content: currentQuestion.content,
          timeLimit: currentQuestion.timeLimit,
          points: currentQuestion.points,
          options: currentQuestion.options.map(o => ({
            id: o.id,
            content: o.content,
            color: o.color
          }))
        },
        questionIndex: session.currentQIndex,
        totalQuestions: session.quiz.totalQuestions
      })

      socket.emit('host:questionActive', {
        questionIndex: session.currentQIndex
      })
    } catch (error) {
      console.error('Host next question error:', error)
      socket.emit('host:error', { message: 'Failed to load next question' })
    }
  })

  // Host ends current question and shows results
  io.on('host:end_question', async ({ sessionId }, socket) => {
    try {
      const session = await sessionService.getSessionById(sessionId)
      const currentQuestion = session.quiz.questions[session.currentQIndex]

      if (!currentQuestion) {
        return socket.emit('host:error', { message: 'No active question' })
      }

      const answers = await prisma.answer.findMany({
        where: {
          sessionId,
          questionId: currentQuestion.id
        },
        include: {
          player: true,
          option: true
        }
      })

      const questionResults = answers.map(a => ({
        playerId: a.player.id,
        nickname: a.player.nickname,
        isCorrect: a.isCorrect,
        timeTaken: a.timeTaken,
        pointsEarned: a.pointsEarned,
        selectedOption: a.option
      }))

      // Calculate stats
      const totalPlayers = session.players.length
      const answeredCount = answers.length
      const correctCount = answers.filter(a => a.isCorrect).length

      io.to(`session:${sessionId}`).emit('question:results', {
        questionResults,
        stats: {
          totalPlayers,
          answeredCount,
          correctCount,
          correctPercentage: totalPlayers > 0 ? Math.round((correctCount / totalPlayers) * 100) : 0
        }
      })

      socket.emit('host:question_ended', {
        questionIndex: session.currentQIndex
      })
    } catch (error) {
      console.error('Host end question error:', error)
      socket.emit('host:error', { message: 'Failed to end question' })
    }
  })

  // Host shows leaderboard
  io.on('host:show_leaderboard', async ({ sessionId }, socket) => {
    try {
      const players = await prisma.player.findMany({
        where: { sessionId },
        orderBy: { totalScore: 'desc' }
      })

      const leaderboard = players.map((p, idx) => ({
        rank: idx + 1,
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        totalScore: p.totalScore
      }))

      io.to(`session:${sessionId}`).emit('leaderboard:update', {
        leaderboard
      })

      socket.emit('host:leaderboard_shown')
    } catch (error) {
      console.error('Host leaderboard error:', error)
      socket.emit('host:error', { message: 'Failed to load leaderboard' })
    }
  })

  // Host ends the game
  io.on('host:end_game', async ({ sessionId }, socket) => {
    try {
      const session = await sessionService.endGame(sessionId)

      // Sort players by score for final results
      const sortedPlayers = session.players.sort((a, b) => b.totalScore - a.totalScore)

      const finalResults = sortedPlayers.map((p, idx) => ({
        rank: idx + 1,
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        totalScore: p.totalScore
      }))

      // Update quiz play count
      await prisma.quiz.update({
        where: { id: session.quizId },
        data: { playCount: { increment: 1 } }
      })

      io.to(`session:${sessionId}`).emit('game:ended', {
        finalResults
      })

      socket.emit('host:game_ended', {
        sessionId,
        totalPlayers: finalResults.length,
        quizId: session.quizId
      })
    } catch (error) {
      console.error('Host end game error:', error)
      socket.emit('host:error', { message: 'Failed to end game' })
    }
  })

  // Host skips to next question (emergency skip)
  io.on('host:skip_question', async ({ sessionId }, socket) => {
    try {
      const session = await sessionService.incrementCurrentQuestion(sessionId)

      socket.emit('host:question_skipped', {
        questionIndex: session.currentQIndex
      })
    } catch (error) {
      console.error('Host skip question error:', error)
      socket.emit('host:error', { message: 'Failed to skip question' })
    }
  })
}

module.exports = initHostHandlers