const pdfService = require('../services/pdf.service')

async function uploadAndGenerateQuiz(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' })
    }
    const fileBuffer = req.file.buffer
    const { questionCount } = req.body

    const text = await pdfService.extractTextFromPDF(fileBuffer)

    if (!text || text.length < 100) {
      return res.status(400).json({
        error: 'PDF has too little text to generate a quiz'
      })
    }

    const count = Math.min(Math.max(parseInt(questionCount) || 10, 1), 50)
    const quizData = await pdfService.generateQuizFromText(text, count)

    const quiz = await pdfService.saveGeneratedQuiz(quizData, req.user.id)

    res.status(201).json({
      success: true,
      message: 'Quiz generated successfully!',
      quiz
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    next(error)
  }
}

module.exports = { uploadAndGenerateQuiz }