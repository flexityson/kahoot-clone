import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sessionService } from '../../services/sessionService'
import Input from '../../components/shared/Input'
import Button from '../../components/shared/Button'
import toast from 'react-hot-toast'

export default function JoinGame() {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const session = await sessionService.getSessionByPin(pin)
      navigate(`/lobby/${session.id}`)
    } catch (error) {
      toast.error('Invalid game PIN')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-2xl font-bold text-gray-800">Join a Game</h1>
          <p className="text-gray-600">Enter the 6-digit PIN</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Game PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            required
          />

          <Button type="submit" disabled={loading || pin.length !== 6} className="w-full">
            {loading ? 'Joining...' : 'Join Game'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <a href="/" className="text-purple-600 hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}