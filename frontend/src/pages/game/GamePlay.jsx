import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSocket, connectSocket } from '../../services/socketService'
import { useGameStore } from '../../store/gameStore'
import Button from '../../components/shared/Button'
import toast from 'react-hot-toast'

export default function GamePlay() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const socket = getSocket() || connectSocket()
  const { currentQuestion, questionIndex, totalQuestions, setCurrentQuestion, setGameState, gameState, player } = useGameStore()
  
  const [timeLeft, setTimeLeft] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const timerRef = useRef(null)
  
  // Track answer feedback
  const [isCorrect, setIsCorrect] = useState(null)
  const [pointsEarned, setPointsEarned] = useState(0)

  // Server-synced timer: clear local interval and use server ticks
  const clearLocalTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    const cleanup = setupSocketListeners()
    return () => {
      clearLocalTimer()
      if (cleanup) cleanup()
    }
  }, [])

  // Fallback local timer only if no server tick received within 1.5s
  useEffect(() => {
    if (currentQuestion && !answered && gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearLocalTimer()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearLocalTimer()
    }
  }, [currentQuestion, answered, gameState, clearLocalTimer])

  useEffect(() => {
    if (gameState === 'ended') {
      navigate(`/results/${sessionId}`)
    }
  }, [gameState, sessionId, navigate])

  const setupSocketListeners = () => {
    const onQuestionNew = (data) => {
      clearLocalTimer()
      setCurrentQuestion(data.question, data.questionIndex, data.totalQuestions)
      setTimeLeft(data.question.timeLimit)
      setAnswered(false)
      setSelectedOption(null)
      setIsCorrect(null)
      setPointsEarned(0)
      setGameState('playing')
    }

    // Sync timer with server ticks
    const onTimerTick = (data) => {
      if (data && typeof data.remaining === 'number') {
        setTimeLeft(data.remaining)
      }
    }

    const onTimerEnded = () => {
      clearLocalTimer()
      setTimeLeft(0)
    }

    const onQuestionResults = () => {
      clearLocalTimer()
      setGameState('results')
    }

    const onAnswerReceived = (data) => {
      setAnswered(true)
      if (data) {
        setIsCorrect(data.isCorrect)
        setPointsEarned(data.pointsEarned)
      }
    }

    const onGameEnded = () => {
      clearLocalTimer()
      setGameState('ended')
    }

    socket.on('question:new', onQuestionNew)
    socket.on('timer:tick', onTimerTick)
    socket.on('timer:ended', onTimerEnded)
    socket.on('question:results', onQuestionResults)
    socket.on('answer:received', onAnswerReceived)
    socket.on('game:ended', onGameEnded)

    return () => {
      socket.off('question:new', onQuestionNew)
      socket.off('timer:tick', onTimerTick)
      socket.off('timer:ended', onTimerEnded)
      socket.off('question:results', onQuestionResults)
      socket.off('answer:received', onAnswerReceived)
      socket.off('game:ended', onGameEnded)
    }
  }

  const handleAnswer = (optionId) => {
    if (answered) return

    setSelectedOption(optionId)
    socket.emit('player:answer', {
      sessionId,
      playerId: player?.id,
      questionId: currentQuestion.id,
      optionId,
      timeTaken: currentQuestion.timeLimit - timeLeft
    })
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="space-y-4 animate-float">
          <span className="text-6xl inline-block">⏳</span>
          <h2 className="text-2xl font-black text-white">Get Ready!</h2>
          <p className="text-slate-400">Waiting for the host to display the next question...</p>
        </div>
      </div>
    )
  }

  const colors = ['red', 'blue', 'yellow', 'green']
  const colorMap = {
    red: 'bg-rose-500 hover:bg-rose-600 border-rose-600 active:bg-rose-700 btn-tactile-red',
    blue: 'bg-blue-500 hover:bg-blue-600 border-blue-600 active:bg-blue-700 btn-tactile-blue',
    yellow: 'bg-amber-500 hover:bg-amber-600 border-amber-600 active:bg-amber-700 btn-tactile-yellow',
    green: 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600 active:bg-emerald-700 btn-tactile-green'
  }

  // Define shape icon markers for Kahoot style accessibility
  const optionIcons = {
    red: '▲',
    blue: '◆',
    yellow: '●',
    green: '■'
  }

  // RESULTS PHASE LAYOUT
  if (gameState === 'results') {
    return (
      <div className={`min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden transition-all duration-500 ${
        isCorrect 
          ? 'bg-emerald-950 text-emerald-100' 
          : selectedOption === null
          ? 'bg-amber-950 text-amber-100'
          : 'bg-rose-950 text-rose-100'
      }`}>
        {/* Simple Confetti Effect for Correct Answers */}
        {isCorrect && Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="confetti bg-purple-500"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#ef4444', '#3b82f6', '#eab308', '#10b981', '#a855f7'][Math.floor(Math.random() * 5)]
            }}
          />
        ))}

        <div className="max-w-md w-full text-center space-y-6 animate-scale-up relative z-10">
          {isCorrect ? (
            <div className="space-y-4">
              <span className="text-8xl block animate-bounce">🎉</span>
              <h1 className="text-5xl font-black tracking-tight text-emerald-400">CORRECT!</h1>
              <p className="text-xl text-emerald-200">Amazing job, you locked in the right answer!</p>
              <div className="inline-block px-8 py-3 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-2xl font-black text-emerald-300">
                +{pointsEarned} PTS
              </div>
            </div>
          ) : selectedOption === null ? (
            <div className="space-y-4">
              <span className="text-8xl block">⏰</span>
              <h1 className="text-5xl font-black tracking-tight text-amber-400">TIME'S UP!</h1>
              <p className="text-xl text-amber-200">You didn't submit an answer in time.</p>
              <div className="inline-block px-8 py-3 rounded-full bg-amber-500/20 border border-amber-400/30 text-xl font-bold text-amber-300">
                +0 PTS
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <span className="text-8xl block">❌</span>
              <h1 className="text-5xl font-black tracking-tight text-rose-400">INCORRECT</h1>
              <p className="text-xl text-rose-200">That wasn't the right answer this time.</p>
              <div className="inline-block px-8 py-3 rounded-full bg-rose-500/20 border border-rose-400/30 text-xl font-bold text-rose-300">
                +0 PTS
              </div>
            </div>
          )}

          <p className="text-sm opacity-60 pt-6 animate-pulse">
            Waiting for the teacher to advance to the next screen...
          </p>
        </div>
      </div>
    )
  }

  // ACTIVE PLAYING PHASE LAYOUT
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between p-6">
      {/* Background blur styling */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[100px] pointer-events-none"></div>

      {/* Header Info */}
      <header className="max-w-5xl mx-auto w-full flex justify-between items-center relative z-10 py-2">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest font-black text-purple-400">Classroom Quest</span>
          <span className="text-sm font-bold text-slate-200">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
        </div>
        
        {/* Pulsing Timer */}
        <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 text-xl font-black transition-all duration-300 ${
          timeLeft <= 5 
            ? 'border-red-500 text-red-500 animate-pulse scale-110 shadow-lg shadow-red-500/20' 
            : 'border-purple-500 text-purple-400'
        }`}>
          {timeLeft}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-5xl mx-auto w-full bg-slate-900 rounded-full h-2 mt-4 relative z-10 overflow-hidden border border-white/5">
        <div
          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-1000"
          style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <main className="flex-grow max-w-5xl mx-auto w-full flex flex-col justify-center gap-8 py-6 relative z-10">
        <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-8 text-center shadow-2xl relative animate-slide-up">
          <h2 className="text-2xl md:text-3xl font-black text-white leading-snug">
            {currentQuestion.content}
          </h2>
        </div>

        {/* Answer Buttons Grid */}
        {!answered ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-scale-up">
            {currentQuestion.options.map((option, idx) => {
              const colorKey = option.color || colors[idx % 4]
              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  className={`btn-tactile ${colorMap[colorKey]} text-white text-left font-black text-xl py-6 px-8 rounded-2xl transition-all duration-200 border-b-4 flex items-center gap-4`}
                >
                  <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg font-mono">
                    {optionIcons[colorKey]}
                  </span>
                  <span>{option.content}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center space-y-4 animate-pulse">
            <span className="text-5xl block animate-bounce">🔒</span>
            <h3 className="text-xl font-bold text-slate-200">Answer Locked In</h3>
            <p className="text-sm text-slate-400">Waiting for other classmates to complete the question...</p>
          </div>
        )}
      </main>

      {/* Footer / User Badge */}
      <footer className="max-w-5xl mx-auto w-full border-t border-white/5 py-4 flex justify-between items-center relative z-10 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>{player?.avatar || '👤'}</span>
          <span className="font-extrabold text-slate-200">{player?.nickname}</span>
        </div>
        <div className="font-mono text-purple-400 font-bold">
          {timeLeft > 0 && !answered ? 'Thinking...' : 'Submitted'}
        </div>
      </footer>
    </div>
  )
}
