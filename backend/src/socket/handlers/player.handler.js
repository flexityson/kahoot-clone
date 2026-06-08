const sessionService = require('../../services/session.service')
const prisma = require('../../config/database')

function initPlayerHandlers(io, socket) {
  // Player joins game with PIN
  socket.on('player:join', async ({ pin, nickname, avatar, userId }) => {
    try {
      const session = await sessionService.getSessionByPin(pin)

      if (!session) {
        socket.emit('player:error', { message: 'Invalid game PIN' })
        return
      }

      if (session.status !== 'WAITING') {
        socket.emit('player:error', { message: 'Game has already started' })
        return
      }

      // Check if user already has a player record
      let player
      if (userId) {
        player = await prisma.player.findFirst({
          where: { sessionId: session.id, userId }
        })
      }

      // Create new player if not exists
      if (!player) {
        player = await prisma.player.create({
          data: {
            sessionId: session.id,
            userId: userId || null,
            nickname,
            avatar,
            totalScore: 0
          }
        })
      }

      socket.join(`session:${session.id}`)
      socket.data.playerId = player.id
      socket.data.sessionId = session.id

      // Notify host and other players
      socket.to(`session:${session.id}`).emit('lobby:player_joined', {
        player: {
          id: player.id,
          nickname: player.nickname,
          avatar: player.avatar,
          totalScore: player.totalScore
        }
      })

      // Send confirmation to joining player
      socket.emit('lobby:joined', {
        session: {
          id: session.id,
          pin: session.pin,
          quizTitle: session.quiz.title
        },
        player: {
          id: player.id,
          nickname: player.nickname,
          avatar: player.avatar
        }
      })
    } catch (error) {
      console.error('Player join error:', error)
      socket.emit('player:error', { message: 'Failed to join game' })
    }
  })

  // Player submits answer
  socket.on('player:answer', async ({ playerId, questionId, optionId, timeTaken }) => {
    try {
      const player = await prisma.player.findUnique({
        where: { id: playerId },
        include: { session: { include: { quiz: true } } }
      })

      if (!player) {
        return socket.emit('player:error', { message: 'Player not found' })
      }

      const question = await prisma.question.findUnique({
        where: { id: questionId },
        include: { options: true }
      })

      if (!question) {
        return socket.emit('player:error', { message: 'Question not found' })
      }

      const selectedOption = question.options.find(o => o.id === optionId)
      const isCorrect = selectedOption?.isCorrect || false

      // Calculate score if correct
      const pointsEarned = isCorrect
        ? Math.round((1 - (timeTaken / question.timeLimit) * 0.5) * question.points)
        : 0

      // Record answer
      await prisma.answer.create({
        data: {
          playerId,
          questionId,
          optionId,
          sessionId: player.sessionId,
          isCorrect,
          timeTaken,
          pointsEarned
        }
      })

      // Update player score
      await prisma.player.update({
        where: { id: playerId },
        data: { totalScore: player.totalScore + pointsEarned }
      })

      socket.emit('answer:received', {
        isCorrect,
        pointsEarned,
        questionId
      })

      // Notify host that answer was received
      socket.to(`session:${player.sessionId}`).emit('host:answer_received', {
        playerId,
        questionId,
        hasAnswered: true
      })
    } catch (error) {
      console.error('Player answer error:', error)
      socket.emit('player:error', { message: 'Failed to submit answer' })
    }
  })

  // Player leaves game
  socket.on('player:leave', async ({ playerId, sessionId }) => {
    try {
      await prisma.player.delete({
        where: { id: playerId }
      })

      socket.leave(`session:${sessionId}`)

      socket.to(`session:${sessionId}`).emit('lobby:player_left', {
        playerId
      })

      socket.emit('player:left', {
        sessionId
      })
    } catch (error) {
      console.error('Player leave error:', error)
    }
  })
}

module.exports = initPlayerHandlers
