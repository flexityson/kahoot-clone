const express = require('express')
const cors = require('cors')
const env = require('./config/env')
const errorHandler = require('./middleware/errorHandler')

const authRoutes = require('./routes/auth.routes')
const quizRoutes = require('./routes/quiz.routes')
const pdfRoutes = require('./routes/pdf.routes')
const sessionRoutes = require('./routes/session.routes')

const app = express()

const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:4173'
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o)) || origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`))
    }
  },
  credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/pdf', pdfRoutes)
app.use('/api/session', sessionRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use(errorHandler)

module.exports = app