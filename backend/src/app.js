const express = require('express')
const cors = require('cors')
const env = require('./config/env')
const errorHandler = require('./middleware/errorHandler')

const authRoutes = require('./routes/auth.routes')
const quizRoutes = require('./routes/quiz.routes')
const pdfRoutes = require('./routes/pdf.routes')
const sessionRoutes = require('./routes/session.routes')

const app = express()

app.use(cors({
  origin: env.FRONTEND_URL || 'http://localhost:5173',
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