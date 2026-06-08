import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sessionService } from '../../services/sessionService'
import { useGameStore } from '../../store/gameStore'
import Button from '../../components/shared/Button'
import Loader from '../../components/shared/Loader'
import Avatar from '../../components/shared/Avatar'

export default function FinalResults() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { finalResults, setFinalResults, player } = useGameStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResults()
  }, [sessionId])

  const loadResults = async () => {
    try {
      const data = await sessionService.getLeaderboard(sessionId)
      setFinalResults(data)
    } catch (error) {
      console.error('Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  const playerResult = finalResults.find(r => r.id === player?.id)
  const rank = playerResult?.rank || finalResults.length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center">
        <Loader size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-gray-800">Game Over!</h1>
        </div>

        {finalResults.length >= 1 && (
          <div className="flex items-end justify-center gap-4 mb-8 h-48">
            {finalResults[1] && (
              <div className="text-center">
                <div className="text-4xl mb-2">{finalResults[1].avatar || '👤'}</div>
                <div className="w-24 h-32 bg-gray-300 rounded-t-lg flex items-end justify-center pb-2">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <p className="font-medium mt-2 truncate w-24">{finalResults[1].nickname}</p>
                <p className="text-sm text-gray-600">{finalResults[1].totalScore} pts</p>
              </div>
            )}

            {finalResults[0] && (
              <div className="text-center">
                <div className="text-5xl mb-2">👑</div>
                <div className="text-4xl mb-2">{finalResults[0].avatar || '👤'}</div>
                <div className="w-28 h-40 bg-yellow-400 rounded-t-lg flex items-end justify-center pb-2">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <p className="font-medium mt-2 truncate w-28">{finalResults[0].nickname}</p>
                <p className="text-sm text-gray-600">{finalResults[0].totalScore} pts</p>
              </div>
            )}

            {finalResults[2] && (
              <div className="text-center">
                <div className="text-4xl mb-2">{finalResults[2].avatar || '👤'}</div>
                <div className="w-24 h-24 bg-orange-300 rounded-t-lg flex items-end justify-center pb-2">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <p className="font-medium mt-2 truncate w-24">{finalResults[2].nickname}</p>
                <p className="text-sm text-gray-600">{finalResults[2].totalScore} pts</p>
              </div>
            )}
          </div>
        )}

        <div className="text-center mb-6">
          <p className="text-gray-600">Your Rank</p>
          <p className="text-4xl font-bold text-purple-600">#{rank}</p>
          {playerResult && (
            <p className="text-lg">{playerResult.totalScore} points</p>
          )}
        </div>

        <div className="space-y-2 mb-6">
          {finalResults.map((r, idx) => (
            <div
              key={r.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                r.id === player?.id ? 'bg-purple-100' : 'bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-bold w-8">{idx + 1}.</span>
                <span className="text-xl">{r.avatar || '👤'}</span>
                <span className="font-medium">{r.nickname}</span>
              </div>
              <span className="font-bold">{r.totalScore} pts</span>
            </div>
          ))}
        </div>

        <Button onClick={() => navigate('/')} className="w-full">
          Back to Home
        </Button>
      </div>
    </div>
  )
}