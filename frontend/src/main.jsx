import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import Login from './pages/auth/Login'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

import TeacherHome from './pages/teacher/TeacherHome'
import TeacherQuizzes from './pages/teacher/TeacherQuizzes'
import TeacherCreate from './pages/teacher/TeacherCreate'
import TeacherEdit from './pages/teacher/TeacherEdit'
import TeacherHost from './pages/teacher/TeacherHost'
import TeacherHostGame from './pages/teacher/TeacherHostGame'
import PDFUpload from './pages/teacher/PDFUpload'

import StudentHome from './pages/student/StudentHome'
import StudentHistory from './pages/student/StudentHistory'

import JoinGame from './pages/game/JoinGame'
import Lobby from './pages/game/Lobby'
import GamePlay from './pages/game/GamePlay'
import FinalResults from './pages/game/FinalResults'

import ProtectedRoute from './components/shared/ProtectedRoute'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />

        {/* Teacher Routes */}
        <Route path="/teacher" element={<ProtectedRoute role="TEACHER" component={TeacherHome} />} />
        <Route path="/teacher/quizzes" element={<ProtectedRoute role="TEACHER" component={TeacherQuizzes} />} />
        <Route path="/teacher/create" element={<ProtectedRoute role="TEACHER" component={TeacherCreate} />} />
        <Route path="/teacher/edit/:id" element={<ProtectedRoute role="TEACHER" component={TeacherEdit} />} />
        <Route path="/teacher/host/:id" element={<ProtectedRoute role="TEACHER" component={TeacherHost} />} />
        <Route path="/teacher/host-game/:sessionId" element={<ProtectedRoute role="TEACHER" component={TeacherHostGame} />} />
        <Route path="/teacher/pdf-upload" element={<ProtectedRoute role="TEACHER" component={PDFUpload} />} />

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute role="STUDENT" component={StudentHome} />} />
        <Route path="/student/history" element={<ProtectedRoute role="STUDENT" component={StudentHistory} />} />

        {/* Game Routes */}
        <Route path="/join" element={<JoinGame />} />
        <Route path="/lobby/:sessionId" element={<Lobby />} />
        <Route path="/game/:sessionId" element={<GamePlay />} />
        <Route path="/results/:sessionId" element={<FinalResults />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)