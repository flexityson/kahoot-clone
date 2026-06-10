import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { sessionService } from '../../services/sessionService'
import { quizService } from '../../services/quizService'
import { getSocket, connectSocket } from '../../services/socketService'
import { useGameStore } from '../../store/gameStore'
import Button from '../../components/shared/Button'
import Loader from '../../components/shared/Loader'
import toast from 'react-hot-toast'
import JoinQrCard from '../../components/teacher/JoinQrCard'

export default function TeacherHost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const socket = getSocket() || connectSocket()

  useEffect(() => {
    loadQuiz()

    const onPlayerJoined = (data) => {
      setSession(prev => ({
        ...prev,
        players: [...(prev?.players || []), data.player]
      }))
    }

    const onPlayerLeft = (data) => {
      setSession(prev => ({
        ...prev,
        players: (prev?.players || []).filter(p => p.id !== data.playerId)
      }))
    }

    socket.on('lobby:player_joined', onPlayerJoined)
    socket.on('lobby:player_left', onPlayerLeft)

    return () => {
      socket.off('lobby:player_joined', onPlayerJoined)
      socket.off('lobby:player_left', onPlayerLeft)
    }
  }, [socket, id])

  const loadQuiz = async () => {
    try {
      const data = await quizService.getQuiz(id)
      setQuiz(data)
    } catch (error) {
      toast.error('Quiz not found')
      navigate('/teacher/quizzes')
    } finally {
      setLoading(false)
    }
  }

  const createSession = async () => {
    try {
      const newSession = await sessionService.createSession(id)
      setSession(newSession)
    } catch (error) {
      toast.error('Failed to create game session')
    }
  }

  const startGame = () => {
    socket.emit('host:start_game', { sessionId: session.id })
    setGameStarted(true)
    navigate(`/teacher/host-game/${session.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader size="large" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-6">{quiz?.title}</h1>
          <Button onClick={createSession} className="w-full">
            Create Game Session
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-2">{quiz?.title}</h1>

          <JoinQrCard pin={session.pin} />

          <p className="text-lg mb-6">
            {session.players?.length || 0} player(s) joined
          </p>

          {gameStarted ? (
            <Button disabled className="w-full">
              Game in Progress...
            </Button>
          ) : (
            <Button onClick={startGame} className="w-full" disabled={!session.players?.length}>
              Start Game
            </Button>
          )}

          <p className="text-sm text-gray-500 mt-4">
            Students join by scanning the QR code above
          </p>
        </div>
      </div>
    </div>
  )
}