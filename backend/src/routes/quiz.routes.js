const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')
const quizController = require('../controllers/quiz.controller')

router.get('/', authMiddleware, quizController.getAllQuizzes)
router.get('/:id', authMiddleware, quizController.getQuiz)
router.post('/', authMiddleware, roleMiddleware('TEACHER'), quizController.createQuiz)
router.put('/:id', authMiddleware, roleMiddleware('TEACHER'), quizController.updateQuiz)
router.put('/:id/questions', authMiddleware, roleMiddleware('TEACHER'), quizController.updateQuestions)
router.delete('/:id', authMiddleware, roleMiddleware('TEACHER'), quizController.deleteQuiz)

module.exports = router