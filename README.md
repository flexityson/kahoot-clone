# 🎓 Classroom Kahoot Clone

A simplified Kahoot-style quiz game platform designed for a single teacher with 30-40 students. Features PDF-to-quiz AI generation for quick classroom quiz creation.

## Features

- 📚 **Quiz Management** - Create, edit, and manage quizzes manually
- 🤖 **AI Quiz Generator** - Upload PDF and auto-generate quiz questions using Groq AI
- 🎮 **Live Game Hosting** - Real-time multiplayer quiz games with Socket.io
- 🏆 **Leaderboards** - Live rankings and final results with podium
- 👤 **Simple Auth** - JWT-based authentication for teachers and students

## Tech Stack

### Backend
- Node.js + Express
- Socket.io (real-time game)
- Prisma ORM
- PostgreSQL (or SQLite for local dev)
- JWT Authentication
- Groq SDK (FREE AI API)

### Frontend
- React 18 + Vite
- Tailwind CSS
- Zustand (state management)
- Socket.io Client
- React Router
- React Dropzone

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL (or use SQLite for local testing)

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

```bash
# backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/kahoot_clone"
JWT_SECRET="your-secret-key"
GROQ_API_KEY="your-groq-api-key"
PORT=5000
```

Get FREE Groq API key: https://console.groq.com/

### 3. Setup Database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 5. Run Development Servers

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Usage

### For Teachers

1. Register with role=TEACHER
2. Go to Dashboard → Create Quiz or AI Generate
3. Upload PDF for instant quiz generation (10-30 seconds)
4. Review/edit questions if needed
5. Click "Host Game" to get a 6-digit PIN
6. Start game when students join

### For Students

1. Go to /join
2. Enter the 6-digit PIN
3. Enter nickname and pick avatar
4. Wait for host to start
5. Answer questions in real-time
6. See results and leaderboard

## API Endpoints

```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login
GET    /api/quiz                - Get all quizzes (teacher only)
GET    /api/quiz/:id            - Get single quiz
POST   /api/quiz                - Create quiz (teacher only)
PUT    /api/quiz/:id            - Update quiz (teacher only)
DELETE /api/quiz/:id            - Delete quiz (teacher only)
POST   /api/pdf/upload          - Upload PDF → AI quiz (teacher only)
POST   /api/session             - Create game session
GET    /api/session/pin/:pin    - Get session by PIN
GET    /api/session/:id         - Get session details
GET    /api/session/:id/leaderboard - Get leaderboard
```

## Socket Events

### Client → Server
- `player:join` - Join game lobby
- `host:start_game` - Start the game
- `host:next_question` - Load next question
- `player:answer` - Submit answer
- `host:end_question` - Show question results
- `host:show_leaderboard` - Display leaderboard
- `host:end_game` - End the game

### Server → Client
- `lobby:player_joined` - New player joined
- `lobby:joined` - Successfully joined lobby
- `game:started` - Game has started
- `question:new` - New question displayed
- `answer:received` - Answer submitted
- `question:results` - Results for question
- `leaderboard:update` - Leaderboard update
- `game:ended` - Game over

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Backend (Railway)
1. Create new project on Railway
2. Connect GitHub repo
3. Add PostgreSQL database
4. Set environment variables
5. Deploy

## Project Structure

```
kahoot-clone/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── socket/
│   │   ├── utils/
│   │   └── app.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        ├── store/
        └── main.jsx
```

## License

MIT