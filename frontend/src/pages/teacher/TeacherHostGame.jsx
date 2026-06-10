import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSocket, connectSocket } from '../../services/socketService'
import Button from '../../components/shared/Button'
import toast from 'react-hot-toast'
import QRCodeDisplay from '../../components/shared/QRCodeDisplay'

export default function TeacherHostGame() {
  const { sessionId } = useParams()
  const lobbyUrl = `${window.location.origin}/lobby/${sessionId}`
  const navigate = useNavigate()
  const socket = getSocket() || connectSocket()
  const [players, setPlayers] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [questionIndex, setQuestionIndex] = useState(-1)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [phase, setPhase] = useState('lobby') // lobby, playing, results, ended
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    socket.emit('host:join_session', { sessionId })

    const onPlayerJoined = (data) => {
      setPlayers(prev => [...prev, data.player])
    }

    const onPlayerLeft = (data) => {
      setPlayers(prev => prev.filter(p => p.id !== data.playerId))
    }

    const onQuestionStarted = (data) => {
      setCurrentQuestion(data.question)
      setQuestionIndex(data.questionIndex)
      setTotalQuestions(data.totalQuestions)
      setTimeLeft(data.timeLimit)
      setPhase('playing')
    }

    const onQuestionEnded = (data) => {
      setPhase('results')
    }

    const onGameEnded = () => {
      setPhase('ended')
    }

    socket.on('lobby:player_joined', onPlayerJoined)
    socket.on('lobby:player_left', onPlayerLeft)
    socket.on('host:question_started', onQuestionStarted)
    socket.on('host:question_ended', onQuestionEnded)
    socket.on('host:game_ended', onGameEnded)

    return () => {
      socket.off('lobby:player_joined', onPlayerJoined)
      socket.off('lobby:player_left', onPlayerLeft)
      socket.off('host:question_started', onQuestionStarted)
      socket.off('host:question_ended', onQuestionEnded)
      socket.off('host:game_ended', onGameEnded)
    }
  }, [sessionId])

  const startGame = () => {
    socket.emit('host:start_game', { sessionId })
  }

  const nextQuestion = () => {
    socket.emit('host:next_question', { sessionId })
  }

  const endQuestion = () => {
    socket.emit('host:end_question', { sessionId })
  }

  const showLeaderboard = () => {
    socket.emit('host:show_leaderboard', { sessionId })
  }

  const endGame = () => {
    socket.emit('host:end_game', { sessionId })
    navigate(`/results/${sessionId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Host Dashboard</h1>
          <p className="text-6xl font-bold text-purple-600 mb-4">
            {players.length}
          </p>
          <p className="text-lg text-gray-600">player(s) connected</p>

          {phase === 'lobby' && (
            <Button onClick={startGame} className="mt-6" disabled={players.length === 0}>
              Start Game
            </Button>
          )}

          {phase === 'playing' && (
            <div className="mt-6 space-y-4">
              <p className="text-xl font-semibold">
                Question {questionIndex + 1} of {totalQuestions}
              </p>
              <p className="text-4xl font-bold">{timeLeft}s</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={endQuestion} variant="outline">
                  End Question Early
                </Button>
              </div>
            </div>
          )}

          {phase === 'results' && (
            <div className="mt-6 space-y-4">
              <p className="text-xl font-semibold">Question Complete!</p>
              {questionIndex + 1 < totalQuestions ? (
                <Button onClick={nextQuestion}>Next Question</Button>
              ) : (
                <div className="space-x-4">
                  <Button onClick={showLeaderboard}>Show Leaderboard</Button>
                  <Button onClick={endGame} variant="outline">End Game</Button>
                </div>
              )}
            </div>
          )}

          {phase === 'ended' && (
            <div className="mt-6">
              <Button onClick={() => navigate(`/results/${sessionId}`)}>
                View Final Results
              </Button>
            </div>
          )}
        </div>

        {/* QR Code for students to join */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400 mb-2">Scan to join game</p>
          <QRCodeDisplay url={lobbyUrl} size={200} />
        </div>

        {/* Players list */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Players</h2>
          {players.length === 0 ? (
            <p className="text-gray-500">Waiting for players to join...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {players.map((p) => (
                <div key={p.id} className="bg-gray-100 rounded-lg p-3 text-center">
                  <p className="font-semibold">{p.nickname}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
