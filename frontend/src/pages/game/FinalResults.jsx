import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { sessionService } from '../../services/sessionService'
import { useGameStore } from '../../store/gameStore'
import Button from '../../components/shared/Button'
import Loader from '../../components/shared/Loader'
import toast from 'react-hot-toast'

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
      toast.error('Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  const playerResult = finalResults.find(r => r.id === player?.id)
  const rank = playerResult?.rank || finalResults.findIndex(r => r.id === player?.id) + 1 || finalResults.length

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size="large" />
      </div>
    )
  }

  if (!loading && finalResults.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-8 text-center max-w-md w-full space-y-4">
          <span className="text-5xl block">📭</span>
          <h2 className="text-xl font-black text-white">No Results Available</h2>
          <p className="text-slate-400 text-sm">We couldn't retrieve any scores for this game session.</p>
          <Button onClick={() => navigate('/')} variant="primary" className="w-full">Back to Home</Button>
        </div>
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

      {/* Confetti Animation */}
      {finalResults.length > 0 && Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="confetti bg-purple-500"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            backgroundColor: ['#eab308', '#3b82f6', '#ef4444', '#10b981', '#a855f7'][Math.floor(Math.random() * 5)]
          }}
        />
      ))}

      <header className="max-w-4xl mx-auto w-full flex justify-between items-center relative z-10 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎓</span>
          <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            CLASSROOM QUEST
          </span>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto w-full flex flex-col items-center justify-center gap-8 py-6 relative z-10">
        
        {/* PODIUM SECTION */}
        {finalResults.length >= 1 && (
          <div className="w-full flex items-end justify-center gap-6 md:gap-10 h-72 mb-4">
            
            {/* 2nd Place Pedestal */}
            {finalResults[1] && (
              <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <span className="text-4xl mb-2">{finalResults[1].avatar || '👤'}</span>
                <span className="font-bold text-sm text-slate-300 truncate w-20 text-center">{finalResults[1].nickname}</span>
                <span className="text-xs text-slate-400 font-mono mb-2">{finalResults[1].totalScore} pts</span>
                <div className="w-24 md:w-28 h-28 bg-gradient-to-t from-slate-800 to-slate-700/50 border-t-4 border-slate-400/80 rounded-t-2xl flex items-center justify-center shadow-lg shadow-black/30">
                  <span className="text-4xl font-black text-slate-300">2</span>
                </div>
              </div>
            )}

            {/* 1st Place Pedestal */}
            {finalResults[0] && (
              <div className="flex flex-col items-center animate-slide-up">
                <span className="text-3xl block animate-bounce mb-1">👑</span>
                <span className="text-5xl mb-2">{finalResults[0].avatar || '👤'}</span>
                <span className="font-black text-base text-yellow-400 truncate w-24 text-center">{finalResults[0].nickname}</span>
                <span className="text-xs text-yellow-300 font-mono mb-2">{finalResults[0].totalScore} pts</span>
                <div className="w-28 md:w-32 h-40 bg-gradient-to-t from-yellow-950/80 to-yellow-800/30 border-t-4 border-yellow-500 rounded-t-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/10">
                  <span className="text-5xl font-black text-yellow-400">1</span>
                </div>
              </div>
            )}

            {/* 3rd Place Pedestal */}
            {finalResults[2] && (
              <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <span className="text-4xl mb-2">{finalResults[2].avatar || '👤'}</span>
                <span className="font-bold text-sm text-slate-300 truncate w-20 text-center">{finalResults[2].nickname}</span>
                <span className="text-xs text-slate-400 font-mono mb-2">{finalResults[2].totalScore} pts</span>
                <div className="w-24 md:w-28 h-20 bg-gradient-to-t from-amber-900 to-amber-800/30 border-t-4 border-amber-600/80 rounded-t-2xl flex items-center justify-center shadow-lg shadow-black/30">
                  <span className="text-4xl font-black text-amber-600">3</span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* INDIVIDUAL PERFORMANCE CARD */}
        {player && playerResult && (
          <div className="w-full max-w-xl bg-purple-950/40 border border-purple-500/25 rounded-3xl p-6 flex justify-between items-center shadow-lg animate-scale-up">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest font-black text-purple-400">Your Standing</span>
              <h3 className="text-xl font-bold text-white">Ranked #{rank}</h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-purple-300">{playerResult.totalScore}</span>
              <span className="text-xs text-purple-400 block font-mono">pts</span>
            </div>
          </div>
        )}

        {/* FULL LEADERBOARD LIST */}
        <div className="w-full max-w-xl bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl animate-scale-up space-y-4">
          <h2 className="text-lg font-black uppercase tracking-wider text-slate-300 border-b border-white/5 pb-3">
            Leaderboard Standings
          </h2>
          
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {finalResults.map((r, idx) => {
              const isCurrentPlayer = r.id === player?.id
              return (
                <div
                  key={r.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                    isCurrentPlayer
                      ? 'bg-purple-600/25 border-purple-500/50 shadow-md'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm w-6 text-slate-400">
                      {idx + 1}.
                    </span>
                    <span className="text-2xl">{r.avatar || '👤'}</span>
                    <span className={`font-bold ${isCurrentPlayer ? 'text-purple-300' : 'text-slate-200'}`}>
                      {r.nickname}
                    </span>
                  </div>
                  <span className="font-mono font-black text-slate-300">{r.totalScore} pts</span>
                </div>
              )
            })}
          </div>
        </div>

        <Button onClick={() => navigate('/')} variant="glass" className="w-full max-w-xl py-3.5 mt-2">
          👋 EXIT TO HOME
        </Button>

      </main>

      <footer className="text-center text-xs text-slate-600 relative z-10 py-4">
        Thank you for playing Classroom Quest!
      </footer>
    </div>
  )
}