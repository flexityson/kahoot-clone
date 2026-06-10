const prisma = require('../config/database')
const generatePIN = require('../utils/generatePIN')

async function createSession(quizId, hostId) {
  // Verify the quiz exists and belongs to the host
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId }
  })
  if (!quiz) {
    throw new Error('Quiz not found')
  }
  if (quiz.teacherId !== hostId) {
    throw new Error('Not authorized to create a session for this quiz')
  }

  let pin
  let attempts = 0
  const maxAttempts = 3

  while (attempts < maxAttempts) {
    pin = generatePIN(6)
    const existing = await prisma.session.findUnique({ where: { pin } })
    if (!existing) {
      break
    }
    attempts++
  }

  if (attempts >= maxAttempts) {
    throw new Error('Unable to generate a unique PIN. Please try again.')
  }

  return prisma.session.create({
    data: {
      pin,
      quizId,
      hostId,
      status: 'WAITING'
    },
    include: {
      quiz: true,
      players: true
    }
  })
}

async function getSessionByPin(pin) {
  return prisma.session.findUnique({
    where: { pin },
    include: {
      quiz: {
        include: {
          questions: {
            include: {
              options: true
            }
          }
        }
      },
      players: true
    }
  })
}

async function getSessionById(id) {
  return prisma.session.findUnique({
    where: { id },
    include: {
      quiz: {
        include: {
          questions: {
            include: {
              options: true
            }
          }
        }
      },
      players: true
    }
  })
}

async function updateSessionStatus(id, status, updates = {}) {
  return prisma.session.update({
    where: { id },
    data: {
      status,
      ...updates
    },
    include: {
      quiz: {
        include: {
          questions: {
            include: {
              options: true
            }
          }
        }
      },
      players: true
    }
  })
}

async function incrementCurrentQuestion(id) {
  return prisma.session.update({
    where: { id },
    data: {
      currentQIndex: { increment: 1 }
    },
    include: {
      quiz: {
        include: {
          questions: {
            include: {
              options: true
            }
          }
        }
      },
      players: true
    }
  })
}

async function endGame(id) {
  return prisma.session.update({
    where: { id },
    data: {
      status: 'ENDED',
      endedAt: new Date()
    },
    include: {
      quiz: true,
      players: {
        orderBy: { totalScore: 'desc' }
      }
    }
  })
}

module.exports = {
  createSession,
  getSessionByPin,
  getSessionById,
  updateSessionStatus,
  incrementCurrentQuestion,
  endGame
}