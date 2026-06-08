const pdfParse = require('pdf-parse')
const { Groq } = require('groq-sdk')
const prisma = require('../config/database')
const env = require('../config/env')

const groq = new Groq({ apiKey: env.GROQ_API_KEY })

async function extractTextFromPDF(fileBuffer) {
  const data = await pdfParse(fileBuffer)
  return data.text.slice(0, 8000)
}

async function generateQuizFromText(text, questionCount = 10) {
  const prompt = `
You are a quiz generator.
Based on the following text, generate exactly ${questionCount} multiple choice questions.

Rules:
- Each question has exactly 4 options
- Only 1 option is correct
- Time limit: 20 seconds per question
- Points: 1000 per question
- Questions must be clear and specific

Return ONLY valid JSON in this exact format:
{
  "title": "Quiz title based on content",
  "questions": [
    {
      "content": "Question text here?",
      "timeLimit": 20,
      "points": 1000,
      "options": [
        { "content": "Option A", "isCorrect": true },
        { "content": "Option B", "isCorrect": false },
        { "content": "Option C", "isCorrect": false },
        { "content": "Option D", "isCorrect": false }
      ]
    }
  ]
}

TEXT TO USE:
${text}
`

  try {
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })

    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    console.error('Groq API error:', error)
    throw new Error('Failed to generate quiz from AI. Please try again.')
  }
}

async function saveGeneratedQuiz(quizData, teacherId) {
  const quiz = await prisma.quiz.create({
    data: {
      title: quizData.title,
      teacherId,
      status: 'DRAFT',
      totalQuestions: quizData.questions.length,
      source: 'PDF',
      questions: {
        create: quizData.questions.map((q, index) => ({
          content: q.content,
          timeLimit: q.timeLimit,
          points: q.points,
          orderIndex: index,
          options: {
            create: q.options.map((opt, i) => ({
              content: opt.content,
              isCorrect: opt.isCorrect,
              orderIndex: i
            }))
          }
        }))
      }
    },
    include: { questions: { include: { options: true } } }
  })

  return quiz
}

module.exports = { extractTextFromPDF, generateQuizFromText, saveGeneratedQuiz }