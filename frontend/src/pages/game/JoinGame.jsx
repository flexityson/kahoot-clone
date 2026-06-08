import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { sessionService } from '../../services/sessionService'
import Button from '../../components/shared/Button'
import toast from 'react-hot-toast'

export default function JoinGame() {
  const [searchParams] = useSearchParams()
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const urlPin = searchParams.get('pin')
    if (urlPin) {
      setPin(urlPin.replace(/\D/g, '').slice(0, 6))
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (pin.length < 4) {
      toast.error('Please enter a valid game PIN')
      return
    }
    setLoading(true)

    try {
      const session = await sessionService.getSessionByPin(pin)
      navigate(`/lobby/${session.id}`)
    } catch (error) {
      toast.error('Invalid game PIN. Please check and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex items-center justify-center p-4">
      {/* Decorative background shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10 animate-scale-up">
        {/* Floating glow decoration behind card */}
        <div className="absolute inset-0 -z-10 rounded-3xl bg-purple-500/10 blur-xl"></div>

        <div className="text-center mb-8">
          <span className="text-5xl inline-block mb-3 animate-float">🎮</span>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Join a Game</h1>
          <p className="text-slate-400 text-sm">Enter the game session PIN below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Game PIN</label>
            <input
              type="text"
              pattern="[0-9]*"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full text-center text-3xl font-black tracking-[0.2em] py-4 rounded-2xl border-2 border-slate-700 bg-slate-900 text-white focus:border-purple-500 focus:outline-none placeholder:tracking-normal placeholder:text-lg uppercase transition-all duration-200"
              required
              autoFocus
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading || pin.length < 4} 
            variant="primary" 
            className="w-full py-4 text-base font-black tracking-widest"
          >
            {loading ? '🚀 Connecting...' : '🚀 ENTER LOBBY'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}