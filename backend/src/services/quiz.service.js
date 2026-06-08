const prisma = require('../config/database')

async function getAllQuizzes(teacherId) {
  return prisma.quiz.findMany({
    where: { teacherId },
    include: {
      questions: {
        include: {
          options: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

async function getQuizById(id) {
  return prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        include: {
          options: true
        }
      }
    }
  })
}

async function createQuiz(data) {
  return prisma.quiz.create({
    data: {
      title: data.title,
      description: data.description,
      coverImage: data.coverImage,
      teacherId: data.teacherId,
      totalQuestions: data.questions?.length || 0,
      status: data.status || 'DRAFT',
      source: data.source || 'MANUAL',
      questions: data.questions ? {
        create: data.questions.map((q, idx) => ({
          content: q.content,
          type: q.type || 'MCQ',
          timeLimit: q.timeLimit || 20,
          points: q.points || 1000,
          orderIndex: idx,
          options: {
            create: q.options.map((opt, i) => ({
              content: opt.content,
              isCorrect: opt.isCorrect,
              color: opt.color,
              orderIndex: i
            }))
          }
        }))
      } : undefined
    },
    include: {
      questions: {
        include: {
          options: true
        }
      }
    }
  })
}

async function updateQuiz(id, data) {
  return prisma.quiz.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      coverImage: data.coverImage,
      status: data.status,
      updatedAt: new Date()
    }
  })
}

async function deleteQuiz(id) {
  return prisma.quiz.delete({
    where: { id }
  })
}

async function updateQuestions(quizId, questions) {
  return prisma.$transaction(async (tx) => {
    await tx.question.deleteMany({
      where: { quizId }
    })

    return tx.quiz.update({
      where: { id: quizId },
      data: {
        totalQuestions: questions.length,
        questions: {
          create: questions.map((q, idx) => ({
            content: q.content,
            type: q.type || 'MCQ',
            timeLimit: q.timeLimit || 20,
            points: q.points || 1000,
            orderIndex: idx,
            options: {
              create: q.options.map((opt, i) => ({
                content: opt.content,
                isCorrect: opt.isCorrect,
                color: opt.color,
                orderIndex: i
              }))
            }
          }))
        }
      },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    })
  })
}

module.exports = { getAllQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz, updateQuestions }