// backend/src/app.js
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { env } = require('./config/env')
const { apiLimiter } = require('./middleware/rateLimit.middleware')
const errorHandler = require('./middleware/errorHandler')

const authRoutes = require('./routes/auth.routes')
const quizRoutes = require('./routes/quiz.routes')
const pdfRoutes = require('./routes/pdf.routes')
const sessionRoutes = require('./routes/session.routes')
const qrRoutes = require('./routes/qr.routes')

const app = express()

app.use(helmet())

const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:4173'
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) ||
      (typeof origin === 'string' && origin.endsWith('.vercel.app') && origin.indexOf('://') > 0)) {
      callback(null, true)
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`))
    }
  },
  credentials: true
}))
app.use(express.json({ limit: '1mb' }))

app.use('/api', apiLimiter)
app.use('/api/auth', authRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/pdf', pdfRoutes)
app.use('/api/session', sessionRoutes)
app.use('/api', qrRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use(errorHandler)

module.exports = app
