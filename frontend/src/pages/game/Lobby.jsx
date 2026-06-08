import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { sessionService } from '../../services/sessionService'
import { getSocket, connectSocket } from '../../services/socketService'
import { useGameStore } from '../../store/gameStore'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/shared/Button'
import Avatar from '../../components/shared/Avatar'
import Loader from '../../components/shared/Loader'

export default function Lobby() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { setSession, setPlayer } = useGameStore()
  const [session, setSessionState] = useState(null)
  const [nickname, setNickname] = useState('')
  const [avatar, setAvatar] = useState('')
  const [joined, setJoined] = useState(false)
  const socket = getSocket() || connectSocket()

  useEffect(() => {
    loadSession()
    setupSocketListeners()

    return () => {
      socket.off('lobby:joined')
      socket.off('lobby:player_joined')
      socket.off('game:started')
    }
  }, [])

  const loadSession = async () => {
    const data = await sessionService.getSession(sessionId)
    setSessionState(data)
    setSession(data)
  }

  const setupSocketListeners = () => {
    socket.on('lobby:joined', (data) => {
      setJoined(true)
      setPlayer(data.player)
    })

    socket.on('lobby:player_joined', (data) => {
      setSessionState(prev => ({
        ...prev,
        players: [...(prev?.players || []), data.player]
      }))
    })

    socket.on('game:started', () => {
      navigate(`/game/${sessionId}`)
    })
  }

  const handleJoin = () => {
    if (!nickname) return

    socket.emit('player:join', {
      pin: session.pin,
      nickname,
      avatar,
      userId: user?.id
    })
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-8">
      <div className="max-w-2xl mx-auto">
        {!joined ? (
          <div className="bg-white rounded-2xl p-8">
            <h1 className="text-2xl font-bold mb-6">Join {session.quiz.title}</h1>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Nickname</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-600 focus:outline-none"
                maxLength={20}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Choose Avatar</label>
              <div className="flex gap-2 flex-wrap">
                {['🐶', '🐱', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setAvatar(emoji)}
                    className={`text-3xl p-3 rounded-xl transition ${
                      avatar === emoji ? 'bg-purple-200 ring-2 ring-purple-600' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleJoin} disabled={!nickname || !avatar} className="w-full">
              Join Game
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Waiting for players...</h2>
            <p className="text-gray-600 mb-6">Game PIN: <span className="font-bold text-purple-600">{session.pin}</span></p>

            <div className="grid grid-cols-3 gap-4 max-h-96 overflow-auto mb-6">
              {session.players?.map((player) => (
                <div key={player.id} className="bg-gray-100 rounded-xl p-4">
                  <div className="text-3xl mb-2">{player.avatar || '👤'}</div>
                  <p className="font-medium truncate">{player.nickname}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              Waiting for host to start the game...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}