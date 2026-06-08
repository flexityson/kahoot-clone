import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { sessionService } from '../../services/sessionService'
import Button from '../../components/shared/Button'
import EmptyState from '../../components/shared/EmptyState'
import toast from 'react-hot-toast'

export default function StudentHistory() {
  const { user } = useAuthStore()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch player history from API
    setLoading(false)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">My Game History</h1>
          <a href="/student">
            <Button variant="outline">Back</Button>
          </a>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : history.length === 0 ? (
          <EmptyState
            icon="🎮"
            title="No games played yet"
            description="Join a game to start building your history"
          />
        ) : (
          <div className="space-y-4">
            {history.map((game) => (
              <div key={game.id} className="bg-white rounded-xl p-4 shadow">
                <h3 className="font-bold text-lg">{game.quizTitle}</h3>
                <p className="text-gray-600">Score: {game.score} | Rank: #{game.rank}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}