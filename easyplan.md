# 🏗️ SIMPLIFIED ARCHITECTURE: Personal Classroom Kahoot Clone
### For 1 Teacher + 30-40 Students | FREE Hosting | PDF → Auto Quiz

---

## 📐 WHAT YOU ACTUALLY NEED (Cut the Fat)

```
❌ REMOVE (Overkill for your use case)
─────────────────────────────────────
❌ Admin Dashboard (you ARE the admin)
❌ Multi-teacher system
❌ Billing / Plans
❌ Kubernetes
❌ CDN (Cloudflare)
❌ SendGrid emails
❌ Background jobs
❌ Audit logs
❌ Redis (30-40 students don't need it)
❌ Separate admin-dashboard/ folder
❌ Role system (just you + students)
❌ Activity logs
❌ Report exports
❌ node-cron jobs

✅ KEEP & SIMPLIFY
─────────────────────────────────────
✅ React Frontend (1 app only)
✅ Node/Express Backend
✅ Socket.io (real-time game)
✅ PostgreSQL OR SQLite
✅ JWT Auth (just login)
✅ Quiz CRUD
✅ Game Engine
✅ PDF Upload → AI Quiz Generator  ← NEW
✅ Simple Results page
```

---

## 📁 SIMPLIFIED FOLDER STRUCTURE

```
my-classroom-kahoot/
│
├── 📁 frontend/                        # One React App
│   ├── 📁 public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── 📁 assets/
│   │       ├── 📁 sounds/
│   │       │   ├── correct.mp3
│   │       │   ├── wrong.mp3
│   │       │   ├── countdown.mp3
│   │       │   ├── game-start.mp3
│   │       │   ├── podium.mp3
│   │       │   └── lobby-music.mp3
│   │       └── 📁 images/
│   │           ├── logo.svg
│   │           └── avatar-1.png ~ avatar-8.png
│   │
│   ├── 📁 src/
│   │   │
│   │   ├── 📁 pages/
│   │   │   │
│   │   │   ├── 📁 auth/
│   │   │   │   └── Login.jsx           # One login page for all
│   │   │   │
│   │   │   ├── 📁 teacher/             # YOUR pages (protected)
│   │   │   │   ├── TeacherHome.jsx     # Dashboard overview
│   │   │   │   ├── TeacherQuizzes.jsx  # All my quizzes list
│   │   │   │   ├── TeacherCreate.jsx   # Manual quiz create
│   │   │   │   ├── TeacherEdit.jsx     # Edit quiz
│   │   │   │   ├── TeacherHost.jsx     # Host game lobby
│   │   │   │   ├── TeacherResults.jsx  # Post-game results
│   │   │   │   └── PDFUpload.jsx       # 🆕 PDF → Quiz page
│   │   │   │
│   │   │   ├── 📁 student/             # STUDENT pages
│   │   │   │   ├── StudentHome.jsx     # Simple home
│   │   │   │   └── StudentHistory.jsx  # Past games
│   │   │   │
│   │   │   ├── 📁 game/                # LIVE GAME pages
│   │   │   │   ├── JoinGame.jsx        # PIN entry
│   │   │   │   ├── Lobby.jsx           # Waiting room
│   │   │   │   ├── GamePlay.jsx        # Active question
│   │   │   │   ├── QuestionResult.jsx  # After each answer
│   │   │   │   ├── Leaderboard.jsx     # Rankings
│   │   │   │   └── FinalResults.jsx    # End screen + podium
│   │   │   │
│   │   │   ├── Home.jsx                # Landing / Join page
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── 📁 components/
│   │   │   │
│   │   │   ├── 📁 teacher/
│   │   │   │   ├── QuizCard.jsx
│   │   │   │   ├── QuizEditor.jsx
│   │   │   │   ├── QuestionCard.jsx
│   │   │   │   ├── OptionEditor.jsx
│   │   │   │   ├── TimerSetting.jsx
│   │   │   │   ├── HostControls.jsx    # Start/Skip/End
│   │   │   │   ├── ResultsChart.jsx
│   │   │   │   └── PDFDropzone.jsx     # 🆕 Drag-drop PDF upload
│   │   │   │
│   │   │   ├── 📁 game/
│   │   │   │   ├── PinInput.jsx
│   │   │   │   ├── NicknameInput.jsx
│   │   │   │   ├── AvatarPicker.jsx
│   │   │   │   ├── CountdownTimer.jsx
│   │   │   │   ├── QuestionDisplay.jsx
│   │   │   │   ├── AnswerButton.jsx
│   │   │   │   ├── ProgressBar.jsx
│   │   │   │   ├── PlayerCard.jsx
│   │   │   │   ├── LeaderboardRow.jsx
│   │   │   │   ├── CorrectAnimation.jsx
│   │   │   │   ├── WrongAnimation.jsx
│   │   │   │   └── PodiumDisplay.jsx
│   │   │   │
│   │   │   └── 📁 shared/
│   │   │       ├── Button.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Toast.jsx
│   │   │       ├── Loader.jsx
│   │   │       ├── Avatar.jsx
│   │   │       ├── ConfirmDialog.jsx
│   │   │       ├── EmptyState.jsx
│   │   │       └── ProtectedRoute.jsx
│   │   │
│   │   ├── 📁 hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useSocket.js
│   │   │   ├── useGame.js
│   │   │   ├── useTimer.js
│   │   │   ├── useQuiz.js
│   │   │   └── useToast.js
│   │   │
│   │   ├── 📁 context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── GameContext.jsx
│   │   │   └── SocketContext.jsx
│   │   │
│   │   ├── 📁 store/                   # Zustand (simpler than Redux)
│   │   │   ├── authStore.js
│   │   │   ├── gameStore.js
│   │   │   └── quizStore.js
│   │   │
│   │   ├── 📁 services/
│   │   │   ├── api.js                  # Axios base
│   │   │   ├── authService.js
│   │   │   ├── quizService.js
│   │   │   ├── gameService.js
│   │   │   ├── pdfService.js           # 🆕 PDF upload + AI call
│   │   │   └── socketService.js
│   │   │
│   │   ├── 📁 utils/
│   │   │   ├── generatePIN.js
│   │   │   ├── calculateScore.js
│   │   │   ├── formatTime.js
│   │   │   └── constants.js
│   │   │
│   │   ├── 📁 styles/
│   │   │   ├── globals.css
│   │   │   ├── game.css
│   │   │   └── animations.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
│
├── 📁 backend/
│   ├── 📁 src/
│   │   │
│   │   ├── 📁 config/
│   │   │   ├── database.js             # SQLite (local) or Postgres
│   │   │   ├── socket.js               # Socket.io setup
│   │   │   └── env.js
│   │   │
│   │   ├── 📁 models/                  # Prisma models
│   │   │   ├── User.js
│   │   │   ├── Quiz.js
│   │   │   ├── Question.js
│   │   │   ├── Option.js
│   │   │   ├── Session.js
│   │   │   ├── Player.js
│   │   │   └── Answer.js
│   │   │
│   │   ├── 📁 routes/
│   │   │   ├── index.js
│   │   │   ├── auth.routes.js
│   │   │   ├── quiz.routes.js
│   │   │   ├── question.routes.js
│   │   │   ├── session.routes.js
│   │   │   └── pdf.routes.js           # 🆕 PDF upload route
│   │   │
│   │   ├── 📁 controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── quiz.controller.js
│   │   │   ├── question.controller.js
│   │   │   ├── session.controller.js
│   │   │   └── pdf.controller.js       # 🆕 PDF → Quiz logic
│   │   │
│   │   ├── 📁 services/
│   │   │   ├── auth.service.js
│   │   │   ├── quiz.service.js
│   │   │   ├── session.service.js
│   │   │   ├── game.service.js
│   │   │   ├── score.service.js
│   │   │   └── pdf.service.js          # 🆕 Parse PDF + call AI
│   │   │
│   │   ├── 📁 middleware/
│   │   │   ├── auth.middleware.js      # JWT check
│   │   │   ├── role.middleware.js      # teacher only guard
│   │   │   ├── upload.middleware.js    # Multer for PDF
│   │   │   └── errorHandler.js
│   │   │
│   │   ├── 📁 socket/
│   │   │   ├── index.js
│   │   │   └── 📁 handlers/
│   │   │       ├── connection.handler.js
│   │   │       ├── game.handler.js
│   │   │       ├── host.handler.js
│   │   │       ├── player.handler.js
│   │   │       ├── timer.handler.js
│   │   │       └── disconnect.handler.js
│   │   │
│   │   ├── 📁 utils/
│   │   │   ├── generatePIN.js
│   │   │   ├── calculateScore.js
│   │   │   ├── jwtHelper.js
│   │   │   ├── hashPassword.js
│   │   │   └── formatResponse.js
│   │   │
│   │   └── app.js
│   │
│   ├── 📁 prisma/
│   │   ├── schema.prisma
│   │   └── 📁 seed/
│   │       ├── seed.js
│   │       └── teacherSeed.js          # Seed YOUR account only
│   │
│   ├── 📁 uploads/                     # 🆕 Temp PDF storage
│   │   └── .gitkeep
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── .gitignore
├── docker-compose.yml                  # Optional local dev
└── README.md
```

---

## 🆕 PDF → AUTO QUIZ FEATURE

```
HOW IT WORKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: You upload PDF
        ↓
STEP 2: Backend extracts text (pdf-parse library)
        ↓
STEP 3: Text sent to AI API (Groq FREE / Gemini FREE)
        ↓
STEP 4: AI returns structured quiz JSON
        ↓
STEP 5: Quiz saved to DB
        ↓
STEP 6: You review/edit questions
        ↓
STEP 7: Host the game!


FLOW DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [Teacher]
      │
      │  drag & drop PDF
      ▼
  [PDFDropzone.jsx]
      │
      │  POST /api/pdf/upload
      │  multipart/form-data
      ▼
  [upload.middleware.js]          ← Multer handles file
      │
      ▼
  [pdf.controller.js]
      │
      ├── pdf-parse(file)         ← Extract raw text
      │
      ├── chunk text if > 3000    ← Avoid token limits
      │   tokens
      │
      └── call AI API             ← Groq or Gemini
              │
              │  Prompt:
              │  "Create 10 multiple choice questions
              │   from this text. Return JSON format:
              │   { questions: [{ content, options:
              │   [{text, isCorrect}], timeLimit,
              │   points }] }"
              │
              ▼
          AI Response (JSON)
              │
              ▼
  [pdf.service.js]
      │
      ├── validate JSON structure
      ├── save quiz to DB
      └── return quizId
              │
              ▼
  [TeacherEdit.jsx]               ← Review & edit before hosting
```

---

## 🆕 PDF SERVICE CODE STRUCTURE

```javascript
// backend/src/services/pdf.service.js

const pdfParse   = require('pdf-parse')
const { Groq }   = require('groq-sdk')        // FREE AI
const prisma     = require('../config/database')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// ─────────────────────────────────────────
// STEP 1: Extract text from PDF
// ─────────────────────────────────────────
async function extractTextFromPDF(fileBuffer) {
  const data = await pdfParse(fileBuffer)
  return data.text.slice(0, 8000)             // limit tokens
}

// ─────────────────────────────────────────
// STEP 2: Send to AI, get quiz JSON back
// ─────────────────────────────────────────
async function generateQuizFromText(text, questionCount = 10) {
  const prompt = `
    You are a quiz generator.
    Based on the following text, generate exactly 
    ${questionCount} multiple choice questions.

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
            { "content": "Option A", "isCorrect": true  },
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

  const response = await groq.chat.completions.create({
    model: 'llama3-8b-8192',                  // FREE on Groq
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    response_format: { type: 'json_object' }  // force JSON
  })

  return JSON.parse(response.choices[0].message.content)
}

// ─────────────────────────────────────────
// STEP 3: Save generated quiz to DB
// ─────────────────────────────────────────
async function saveGeneratedQuiz(quizData, teacherId) {
  const quiz = await prisma.quiz.create({
    data: {
      title:          quizData.title,
      teacherId:      teacherId,
      status:         'draft',
      totalQuestions: quizData.questions.length,
      questions: {
        create: quizData.questions.map((q, index) => ({
          content:    q.content,
          timeLimit:  q.timeLimit,
          points:     q.points,
          orderIndex: index,
          options: {
            create: q.options.map((opt, i) => ({
              content:    opt.content,
              isCorrect:  opt.isCorrect,
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

module.exports = {
  extractTextFromPDF,
  generateQuizFromText,
  saveGeneratedQuiz
}
```

---

## 🆕 PDF CONTROLLER

```javascript
// backend/src/controllers/pdf.controller.js

const pdfService = require('../services/pdf.service')

async function uploadAndGenerateQuiz(req, res) {
  try {
    // 1. Get uploaded file from Multer
    const fileBuffer = req.file.buffer

    // 2. Extract text
    const text = await pdfService.extractTextFromPDF(fileBuffer)

    if (!text || text.length < 100) {
      return res.status(400).json({
        error: 'PDF has too little text to generate a quiz'
      })
    }

    // 3. Ask AI to generate quiz
    const questionCount = req.body.questionCount || 10
    const quizData = await pdfService.generateQuizFromText(
      text,
      questionCount
    )

    // 4. Save to database
    const quiz = await pdfService.saveGeneratedQuiz(
      quizData,
      req.user.id                 // from JWT middleware
    )

    // 5. Return quiz for teacher to review
    res.status(201).json({
      success: true,
      message: 'Quiz generated successfully!',
      quiz
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    res.status(500).json({ error: 'Failed to generate quiz' })
  }
}

module.exports = { uploadAndGenerateQuiz }
```

---

## 🆕 PDF ROUTE + MULTER

```javascript
// backend/src/routes/pdf.routes.js

const express        = require('express')
const router         = express.Router()
const multer         = require('multer')
const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')
const pdfController  = require('../controllers/pdf.controller')

// Store PDF in memory (no disk needed)
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 },   // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files allowed'), false)
    }
  }
})

// POST /api/pdf/upload
// Only teacher can upload
router.post(
  '/upload',
  authMiddleware,                              // must be logged in
  roleMiddleware('teacher'),                   // must be teacher
  upload.single('pdf'),                        // one PDF file
  pdfController.uploadAndGenerateQuiz
)

module.exports = router
```

---

## 🆕 PDF UPLOAD PAGE (Frontend)

```javascript
// frontend/src/pages/teacher/PDFUpload.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { pdfService } from '../../services/pdfService'

export default function PDFUpload() {
  const [file, setFile]           = useState(null)
  const [questionCount, setCount] = useState(10)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const navigate                  = useNavigate()

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('pdf', file)
      formData.append('questionCount', questionCount)

      const { quiz } = await pdfService.uploadPDF(formData)

      // Go straight to edit page to review questions
      navigate(`/teacher/edit/${quiz.id}`)

    } catch (err) {
      setError('Failed to generate quiz. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        📄 Upload PDF → Auto Generate Quiz
      </h1>

      {/* Dropzone */}
      <div
        className="border-2 border-dashed border-purple-400
                   rounded-xl p-10 text-center cursor-pointer
                   hover:bg-purple-50 transition"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          setFile(e.dataTransfer.files[0])
        }}
        onClick={() => document.getElementById('pdf-input').click()}
      >
        <input
          id="pdf-input"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file ? (
          <p className="text-green-600 font-semibold">
            ✅ {file.name}
          </p>
        ) : (
          <p className="text-gray-500">
            Drag & drop your PDF here, or click to browse
          </p>
        )}
      </div>

      {/* Question count slider */}
      <div className="mt-6">
        <label className="font-medium">
          Number of questions: {questionCount}
        </label>
        <input
          type="range" min="5" max="20"
          value={questionCount}
          onChange={(e) => setCount(e.target.value)}
          className="w-full mt-2"
        />
      </div>

      {error && (
        <p className="text-red-500 mt-3">{error}</p>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="mt-6 w-full bg-purple-600 text-white
                   py-3 rounded-xl font-bold text-lg
                   disabled:opacity-50"
      >
        {loading ? '🤖 Generating Quiz...' : '✨ Generate Quiz'}
      </button>

      {loading && (
        <p className="text-center text-gray-500 mt-3 text-sm">
          AI is reading your PDF and creating questions...
          This takes 10-30 seconds ⏳
        </p>
      )}
    </div>
  )
}
```

---

## 🗄️ SIMPLIFIED DATABASE SCHEMA

```
Only 7 tables needed (no logs, reports, billing)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────┐
│ TABLE: users  (you + your 30-40 students)               │
├─────────────────┬────────────────┬──────────────────────┤
│ id              │ UUID (PK)      │                      │
│ name            │ VARCHAR(100)   │                      │
│ email           │ VARCHAR(255)   │ UNIQUE               │
│ password_hash   │ TEXT           │                      │
│ role            │ ENUM           │ teacher / student    │
│ avatar_url      │ TEXT           │ nullable             │
│ created_at      │ TIMESTAMP      │                      │
└─────────────────┴────────────────┴──────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TABLE: quizzes                                          │
├─────────────────┬────────────────┬──────────────────────┤
│ id              │ UUID (PK)      │                      │
│ title           │ VARCHAR(200)   │                      │
│ description     │ TEXT           │ nullable             │
│ cover_image     │ TEXT           │ nullable             │
│ teacher_id      │ UUID (FK)      │ → users.id           │
│ total_questions │ INT            │                      │
│ play_count      │ INT            │ default: 0           │
│ status          │ ENUM           │ draft / published    │
│ source          │ ENUM           │ manual / pdf         │
│ created_at      │ TIMESTAMP      │                      │
└─────────────────┴────────────────┴──────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TABLE: questions                                        │
├─────────────────┬────────────────┬──────────────────────┤
│ id              │ UUID (PK)      │                      │
│ quiz_id         │ UUID (FK)      │ → quizzes.id         │
│ content         │ TEXT           │                      │
│ type            │ ENUM           │ mcq / true-false     │
│ time_limit      │ INT            │ default: 20 seconds  │
│ points          │ INT            │ default: 1000        │
│ order_index     │ INT            │                      │
└─────────────────┴────────────────┴──────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TABLE: options                                          │
├─────────────────┬────────────────┬──────────────────────┤
│ id              │ UUID (PK)      │                      │
│ question_id     │ UUID (FK)      │ → questions.id       │
│ content         │ VARCHAR(300)   │                      │
│ is_correct      │ BOOLEAN        │                      │
│ color           │ VARCHAR(10)    │ red/blue/yellow/green│
│ order_index     │ INT            │                      │
└─────────────────┴────────────────┴──────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TABLE: sessions                                         │
├─────────────────┬────────────────┬──────────────────────┤
│ id              │ UUID (PK)      │                      │
│ pin             │ VARCHAR(6)     │ UNIQUE               │
│ quiz_id         │ UUID (FK)      │ → quizzes.id         │
│ host_id         │ UUID (FK)      │ → users.id (you)     │
│ status          │ ENUM           │ waiting/live/ended   │
│ current_q_index │ INT            │ default: 0           │
│ started_at      │ TIMESTAMP      │ nullable             │
│ ended_at        │ TIMESTAMP      │ nullable             │
│ created_at      │ TIMESTAMP      │                      │
└─────────────────┴────────────────┴──────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TABLE: players                                          │
├─────────────────┬────────────────┬──────────────────────┤
│ id              │ UUID (PK)      │                      │
│ session_id      │ UUID (FK)      │ → sessions.id        │
│ user_id         │ UUID (FK)      │ nullable (guest ok)  │
│ nickname        │ VARCHAR(50)    │                      │
│ avatar          │ VARCHAR(50)    │                      │
│ total_score     │ INT            │ default: 0           │
│ rank            │ INT            │                      │
│ joined_at       │ TIMESTAMP      │                      │
└─────────────────┴────────────────┴──────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TABLE: answers                                          │
├─────────────────┬────────────────┬──────────────────────┤
│ id              │ UUID (PK)      │                      │
│ player_id       │ UUID (FK)      │ → players.id         │
│ question_id     │ UUID (FK)      │ → questions.id       │
│ option_id       │ UUID (FK)      │ → options.id         │
│ session_id      │ UUID (FK)      │ → sessions.id        │
│ is_correct      │ BOOLEAN        │                      │
│ time_taken      │ FLOAT          │ seconds              │
│ points_earned   │ INT            │                      │
│ answered_at     │ TIMESTAMP      │                      │
└─────────────────┴────────────────┴──────────────────────┘
```

---

## 🔐 SIMPLIFIED RBAC

```
PERMISSION              TEACHER(YOU)    STUDENT     GUEST
──────────────────────────────────────────────────────────
Upload PDF + Gen Quiz       ✅             ❌          ❌
Create/Edit Quiz            ✅             ❌          ❌
Delete Quiz                 ✅             ❌          ❌
Host Game                   ✅             ❌          ❌
View Results                ✅             ❌          ❌

Join Game (PIN)             ✅             ✅          ✅
See Leaderboard             ✅             ✅          ✅
View Own History            ✅             ✅          ❌
```

---

## ⚡ SOCKET EVENTS (Same, Simplified)

```
CLIENT → SERVER                    SERVER → CLIENT
──────────────────────────────────────────────────────────
[player:join]        ────►         [lobby:player_joined]
[host:start_game]    ────►         [game:started]
[host:next_question] ────►         [question:new]
[player:answer]      ────►         [answer:received]
[host:end_question]  ────►         [question:results]
[host:show_leaderboard]────►       [leaderboard:update]
[host:end_game]      ────►         [game:ended]
[player:disconnect]  ────►         [player:left]
```

---

## 🆓 FREE HOSTING PLAN (Best for Your Case)

```
WHERE TO HOST EVERYTHING FOR FREE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SERVICE         WHAT            FREE TIER           SPEED
──────────────────────────────────────────────────────────
Vercel          Frontend        Unlimited deploys   ⚡⚡⚡⚡⚡
                React app       100GB bandwidth
                                Auto HTTPS

Railway         Backend         $5 free credit/mo   ⚡⚡⚡⚡
                Node+Express    500 hours runtime
                + Socket.io     (enough for class)

Railway         PostgreSQL      1GB storage FREE     ⚡⚡⚡⚡
                Database        Included in above

Groq            AI API          FREE                ⚡⚡⚡⚡⚡
                PDF→Quiz        14,400 req/day
                Llama 3 model   Fastest AI API

Cloudinary      Images          25GB FREE           ⚡⚡⚡⚡
  (optional)    Quiz covers     25K transforms

GitHub          Code repo       FREE unlimited       ─
                CI/CD           Actions included

──────────────────────────────────────────────────────────
TOTAL COST:  $0/month  ✅
──────────────────────────────────────────────────────────

WHY THESE CHOICES:
✅ Vercel   → Best free frontend host, instant deploys
✅ Railway  → Best free Node.js + PostgreSQL combo
✅ Groq     → Fastest FREE AI, better than OpenAI free
✅ No Redis → 30-40 students don't need it
✅ No CDN   → Not needed at this scale
```

---

## 🚀 DEPLOYMENT ARCHITECTURE (Simple)

```
YOUR STUDENTS
(phone/laptop)
     │
     │  yourgame.vercel.app
     ▼
┌────────────────┐          ┌─────────────────────┐
│   FRONTEND     │  HTTP +  │     BACKEND          │
│   React App    │◄────────►│  Node.js + Express  │
│   on Vercel    │  WS      │  + Socket.io        │
│                │          │  on Railway          │
└────────────────┘          └──────────┬──────────┘
                                       │
                            ┌──────────▼──────────┐
                            │    POSTGRESQL        │
                            │    on Railway        │
                            │    (same project)    │
                            └─────────────────────┘

                            + Groq API (external)
                              for PDF→Quiz AI
```

---

## 📦 KEY PACKAGES

```
FRONTEND                    BACKEND
────────────────────────    ────────────────────────
react + vite                express
react-router-dom            socket.io
socket.io-client            prisma + @prisma/client
zustand                     jsonwebtoken
axios                       bcryptjs
tailwindcss                 multer
recharts                    pdf-parse
react-dropzone              groq-sdk
react-hot-toast             zod
framer-motion               cors
                            dotenv
                            nodemon (dev)
```

---

## ✅ BUILD ORDER FOR YOU

```
Week 1  ──►  Setup + Auth + DB schema
Week 2  ──►  Quiz CRUD (create, edit, delete)
Week 3  ──►  Socket Game Engine (host + join + play)
Week 4  ──►  PDF Upload + AI Quiz Generator
Week 5  ──►  Polish UI + Deploy to Vercel + Railway
Week 6  ──►  Test with your real students 🎉

DAILY CLASS WORKFLOW:
──────────────────────────────────────────
1. Upload your lesson PDF (30 seconds)
2. AI generates 10 questions (20 seconds)
3. Review / tweak questions (2 minutes)
4. Click "Host Game" → get PIN
5. Students go to your URL → enter PIN
6. Play! 🎮
7. See results after game
──────────────────────────────────────────
```