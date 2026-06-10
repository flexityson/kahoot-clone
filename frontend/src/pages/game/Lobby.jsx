// frontend/src/pages/game/Lobby.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { sessionService } from '../../services/sessionService'
import { getSocket, connectSocket } from '../../services/socketService'
import { useGameStore } from '../../store/gameStore'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/shared/Button'
import Loader from '../../components/shared/Loader'
import toast from 'react-hot-toast'
import { extractPinFromUrl } from '../../utils/joinUrl'

export default function Lobby() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  const { setSession, setPlayer } = useGameStore()
  const [session, setSessionState] = useState(null)
  const [nickname, setNickname] = useState('')
  const [avatar, setAvatar] = useState('🐶')
  const [joined, setJoined] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const socket = getSocket() || connectSocket()

  useEffect(() => {
    // Extract PIN from URL if no sessionId is provided
    // This handles direct /play/:pin access
    if (!sessionId) {
      const extractedPin = extractPinFromUrl(location.pathname + location.search)
      if (extractedPin) {
        // Fetch session by PIN and navigate to proper URL
        const fetchSession = async () => {
          try {
            const sessionData = await sessionService.getSessionByPin(extractedPin)
            navigate(`/lobby/${sessionData.id}`)
          } catch (error) {
            toast.error('Unable to find session with this PIN')
            navigate('/')
          }
        }
        fetchSession()
      }
    }
  }, [sessionId, location])

  useEffect(() => {
    if (sessionId) {
      loadSession()
    }
    setupSocketListeners()

    return () => {
      socket.off('lobby:joined')
      socket.off('lobby:player_joined')
      socket.off('game:started')
    }
  }, [sessionId])

  const loadSession = async () => {
    try {
      const data = await sessionService.getSession(sessionId)
      setSessionState(data)
      setSession(data)
      setLoadError(false)

      // If we have state from join form, use it
      if (location.state && location.state.pin) {
        setNickname(location.state.nickname || '')
        setAvatar(location.state.avatar || '🐶')
      }
    } catch (error) {
      setLoadError(true)
      toast.error('Failed to load game session')
    }
  }

  const setupSocketListeners = () => {
    socket.on('lobby:joined', (data) => {
      setJoined(true)
      setPlayer(data.player)
      toast.success(`Welcome to the lobby, ${data.player.nickname}!`)
    })

    socket.on('lobby:player_joined', (data) => {
      setSessionState(prev => {
        if (!prev) return prev
        // Prevent duplicate player rendering
        if (prev.players?.some(p => p.id === data.player.id)) return prev
        return {
          ...prev,
          players: [...(prev.players || []), data.player]
        }
      })
    })

    socket.on('game:started', () => {
      toast.success('Game is starting! Get ready!')
      navigate(`/game/${sessionId}`)
    })
  }

  const handleJoin = () => {
    const trimmed = nickname.trim()
    if (!trimmed) {
      toast.error('Please enter a nickname')
      return
    }

    socket.emit('player:join', {
      pin: session.pin,
      nickname: trimmed,
      avatar,
      userId: user?.id
    })
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <span className="text-6xl inline-block">⚠️</span>
          <h2 className="text-2xl font-black text-white">Session Not Found</h2>
          <p className="text-slate-400">Unable to load the game session. It may have ended or the link is invalid.</p>
          <button onClick={() => navigate('/')} className="text-purple-400 font-bold hover:text-purple-300 transition">
            ← Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between p-6">
      {/* Decorative background shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <header className="max-w-5xl mx-auto w-full flex justify-between items-center relative z-10 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎓</span>
          <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            CLASSROOM QUEST
          </span>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
          Lobby
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center relative z-10 py-12">
        <div className="max-w-3xl w-full">
          {!joined ? (
            <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative animate-scale-up">
              <div className="text-center mb-6">
                <span className="text-4xl">🏷️</span>
                <h1 className="text-2xl font-black mt-2 text-white">Join {session.quiz.title}</h1>
                <p className="text-slate-400 text-sm">Choose your avatar and type a nickname</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Nickname</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter your nickname"
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:border-purple-500 focus:outline-none transition-all duration-200"
                    maxLength={20}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Choose Avatar</label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {['🐶', '🐱', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setAvatar(emoji)}
                        className={`text-3xl p-3 rounded-xl transition-all duration-200 active:scale-90 ${
                          avatar === emoji
                            ? 'bg-purple-600/35 border-2 border-purple-500 shadow-lg shadow-purple-500/20 scale-105'
                            : 'bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleJoin}
                  disabled={!nickname.trim()}
                  variant="primary"
                  className="w-full py-4 text-base font-black tracking-widest mt-4"
                >
                  🚀 JOIN ROOM
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center relative animate-scale-up">
              <div className="space-y-2 mb-8">
                <span className="text-4xl animate-pulse inline-block">🎮</span>
                <h2 className="text-3xl font-black text-white">Waiting for players...</h2>
                <p className="text-slate-400 text-sm">The game will start when the teacher is ready</p>
                <div className="inline-flex flex-col items-center gap-1 mt-4 px-8 py-3 rounded-2xl bg-slate-900/60 border border-purple-500/20">
                  <span className="text-xs uppercase tracking-widest font-black text-purple-400">Game PIN</span>
                  <span className="text-4xl font-black tracking-widest text-white">{session.pin}</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6">
                <h3 className="text-left text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex justify-between">
                  <span>Players in Lobby</span>
                  <span className="text-purple-400 font-mono font-black">{session.players?.length || 0}</span>
                </h3>

                {session.players?.length === 0 ? (
                  <div className="py-12 text-slate-500 text-sm">
                    You are the first player to join! Wait for others.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-2">
                    {session.players?.map((player) => (
                      <div
                        key={player.id}
                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center animate-scale-up hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <span className="text-3xl mb-2">{player.avatar || '👤'}</span>
                        <span className="font-bold text-sm text-slate-200 truncate w-full text-center">{player.nickname}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-purple-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                Connected to host server
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center text-xs text-slate-600 relative z-10 py-4">
        Go to <span className="font-mono text-purple-400 font-bold">/join</span> on your device to play.
      </footer>
    </div>
  )
}