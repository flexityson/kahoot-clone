const express = require('express')
const router = express.Router()
const { z } = require('zod')
const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')
const { validate } = require('../middleware/validate.middleware')
const quizController = require('../controllers/quiz.controller')

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const quizIdSchema = z.object({
  id: z.string().regex(uuidRegex, 'Invalid quiz ID format')
})

const createQuizSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  questions: z.array(z.object({
    content: z.string().min(1, 'Question content is required'),
    timeLimit: z.number().int().positive().optional(),
    points: z.number().int().positive().optional(),
    options: z.array(z.object({
      content: z.string().min(1, 'Option content is required'),
      isCorrect: z.boolean()
    })).min(4, 'Must have at least 4 options').max(4, 'Must have at most 4 options')
  })).min(1, 'Must have at least 1 question')
})

const updateQuizSchema = z.object({
  id: z.string().regex(uuidRegex, 'Invalid quiz ID format'),
  title: z.string().min(1, 'Title is required').optional(),
  questions: z.array(z.object({
    content: z.string().min(1, 'Question content is required'),
    timeLimit: z.number().int().positive().optional(),
    points: z.number().int().positive().optional(),
    options: z.array(z.object({
      content: z.string().min(1, 'Option content is required'),
      isCorrect: z.boolean()
    })).min(4, 'Must have at least 4 options').max(4, 'Must have at most 4 options')
  })).optional()
})

const updateQuestionsSchema = z.object({
  id: z.string().regex(uuidRegex, 'Invalid quiz ID format'),
  questions: z.array(z.object({
    content: z.string().min(1, 'Question content is required'),
    timeLimit: z.number().int().positive().optional(),
    points: z.number().int().positive().optional(),
    options: z.array(z.object({
      content: z.string().min(1, 'Option content is required'),
      isCorrect: z.boolean()
    })).min(4, 'Must have at least 4 options').max(4, 'Must have at most 4 options')
  })).min(1, 'Must have at least 1 question')
})

router.get('/', authMiddleware, quizController.getAllQuizzes)
router.get('/:id', authMiddleware, validate(quizIdSchema), quizController.getQuiz)
router.post('/', authMiddleware, roleMiddleware('TEACHER'), validate(createQuizSchema), quizController.createQuiz)
router.put('/:id', authMiddleware, roleMiddleware('TEACHER'), validate(updateQuizSchema), quizController.updateQuiz)
router.put('/:id/questions', authMiddleware, roleMiddleware('TEACHER'), validate(updateQuestionsSchema), quizController.updateQuestions)
router.delete('/:id', authMiddleware, validate(quizIdSchema), quizController.deleteQuiz)

module.exports = router