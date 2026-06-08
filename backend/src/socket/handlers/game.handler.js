const { getIO } = require('../../config/socket')
const sessionService = require('../../services/session.service')
const prisma = require('../../config/database')
const calculateScore = require('../../utils/calculateScore')

function initGameHandlers() {
  const io = getIO()

  io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`)

    socket.on('player:join', async ({ pin, nickname, avatar, userId }) => {
      try {
        const session = await sessionService.getSessionByPin(pin)

        if (!session || session.status !== 'WAITING') {
          socket.emit('error', { message: 'Invalid or expired game PIN' })
          return
        }

        const player = await prisma.player.create({
          data: {
            sessionId: session.id,
            userId: userId || null,
            nickname,
            avatar,
            totalScore: 0
          }
        })

        socket.join(`session:${session.id}`)
        socket.data.playerId = player.id

        io.to(`session:${session.id}`).emit('lobby:player_joined', {
          player: {
            id: player.id,
            nickname: player.nickname,
            avatar: player.avatar,
            totalScore: player.totalScore
          }
        })

        socket.emit('lobby:joined', {
          session,
          player
        })
      } catch (error) {
        console.error('Player join error:', error)
        socket.emit('error', { message: 'Failed to join game' })
      }
    })

    socket.on('host:start_game', async ({ sessionId }) => {
      try {
        const session = await sessionService.updateSessionStatus(sessionId, 'LIVE')

        io.to(`session:${sessionId}`).emit('game:started', {
          quiz: session.quiz
        })
      } catch (error) {
        console.error('Start game error:', error)
        socket.emit('error', { message: 'Failed to start game' })
      }
    })

    socket.on('host:next_question', async ({ sessionId }) => {
      try {
        const session = await sessionService.incrementCurrentQuestion(sessionId)
        const currentQuestion = session.quiz.questions[session.currentQIndex]

        if (!currentQuestion) {
          io.to(`session:${sessionId}`).emit('game:ended')
          return
        }

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
      } catch (error) {
        console.error('Next question error:', error)
        socket.emit('error', { message: 'Failed to load next question' })
      }
    })

    socket.on('player:answer', async ({ playerId, questionId, optionId, timeTaken }) => {
      try {
        const player = await prisma.player.findUnique({
          where: { id: playerId },
          include: { session: { include: { quiz: true } } }
        })

        if (!player) return

        const question = await prisma.question.findUnique({
          where: { id: questionId },
          include: { options: true }
        })

        const selectedOption = question.options.find(o => o.id === optionId)
        const isCorrect = selectedOption?.isCorrect || false

        const pointsEarned = isCorrect
          ? calculateScore(timeTaken, question.timeLimit, question.points)
          : 0

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

        await prisma.player.update({
          where: { id: playerId },
          data: { totalScore: player.totalScore + pointsEarned }
        })

        socket.emit('answer:received', {
          isCorrect,
          pointsEarned
        })
      } catch (error) {
        console.error('Answer error:', error)
      }
    })

    socket.on('host:end_question', async ({ sessionId }) => {
      try {
        const session = await sessionService.getSessionById(sessionId)
        const currentQuestion = session.quiz.questions[session.currentQIndex]

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

        io.to(`session:${sessionId}`).emit('question:results', {
          questionResults
        })
      } catch (error) {
        console.error('End question error:', error)
        socket.emit('error', { message: 'Failed to end question' })
      }
    })

    socket.on('host:show_leaderboard', async ({ sessionId }) => {
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
      } catch (error) {
        console.error('Leaderboard error:', error)
        socket.emit('error', { message: 'Failed to load leaderboard' })
      }
    })

    socket.on('host:end_game', async ({ sessionId }) => {
      try {
        const session = await sessionService.endGame(sessionId)

        const finalResults = session.players.map((p, idx) => ({
          rank: idx + 1,
          id: p.id,
          nickname: p.nickname,
          avatar: p.avatar,
          totalScore: p.totalScore
        }))

        io.to(`session:${sessionId}`).emit('game:ended', {
          finalResults
        })
      } catch (error) {
        console.error('End game error:', error)
        socket.emit('error', { message: 'Failed to end game' })
      }
    })

    socket.on('disconnect', () => {
      console.log(`Player disconnected: ${socket.id}`)

      if (socket.data.playerId) {
        prisma.player.delete({
          where: { id: socket.data.playerId }
        }).catch(console.error)
      }
    })
  })
}

module.exports = initGameHandlers