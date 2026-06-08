const quizService = require('../services/quiz.service')

async function getAllQuizzes(req, res, next) {
  try {
    const quizzes = await quizService.getAllQuizzes(req.user.id)

    res.status(200).json({
      success: true,
      quizzes
    })
  } catch (error) {
    next(error)
  }
}

async function getQuiz(req, res, next) {
  try {
    const quiz = await quizService.getQuizById(req.params.id)

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' })
    }

    res.status(200).json({
      success: true,
      quiz
    })
  } catch (error) {
    next(error)
  }
}

async function createQuiz(req, res, next) {
  try {
    const { title, description, coverImage, questions } = req.body

    const quiz = await quizService.createQuiz({
      title,
      description,
      coverImage,
      teacherId: req.user.id,
      questions
    })

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quiz
    })
  } catch (error) {
    next(error)
  }
}

async function updateQuiz(req, res, next) {
  try {
    const { title, description, coverImage, status } = req.body

    const quiz = await quizService.updateQuiz(req.params.id, {
      title,
      description,
      coverImage,
      status
    })

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      quiz
    })
  } catch (error) {
    next(error)
  }
}

async function updateQuestions(req, res, next) {
  try {
    const { questions } = req.body

    const quiz = await quizService.updateQuestions(req.params.id, questions)

    res.status(200).json({
      success: true,
      message: 'Questions updated successfully',
      quiz
    })
  } catch (error) {
    next(error)
  }
}

async function deleteQuiz(req, res, next) {
  try {
    await quizService.deleteQuiz(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAllQuizzes, getQuiz, createQuiz, updateQuiz, updateQuestions, deleteQuiz }