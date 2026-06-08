import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import Button from '../components/shared/Button'
import Input from '../components/shared/Input'
import toast from 'react-hot-toast'

export default function Home() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  const handleJoinGame = (e) => {
    e.preventDefault()
    if (!pin || pin.length < 4) {
      toast.error('Please enter a valid PIN')
      return
    }
    navigate(`/join?pin=${pin}`)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between">
      {/* Decorative background shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Glassmorphic Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/60 border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-3xl">🎓</span>
            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400">
              CLASSROOM QUEST
            </span>
          </Link>
          
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end text-sm">
                  <span className="font-semibold text-slate-200">Hi, {user?.name}</span>
                  <span className="text-xs text-purple-400 font-mono font-bold tracking-wider">{user?.role}</span>
                </div>
                {user?.role === 'TEACHER' ? (
                  <Link to="/teacher">
                    <Button variant="primary" className="py-2.5 text-xs">Dashboard</Button>
                  </Link>
                ) : (
                  <Link to="/student">
                    <Button variant="primary" className="py-2.5 text-xs">Dashboard</Button>
                  </Link>
                )}
                <Button variant="glass" onClick={handleLogout} className="py-2.5 text-xs">
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="glass" className="py-2.5 text-xs">Teacher Portal</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Hero & PIN Join section */}
      <main className="flex-grow flex items-center justify-center px-6 py-12 relative z-10">
        <div className="max-w-6xl w-full grid md:grid-cols-12 gap-12 items-center">
          
          {/* Left: Headline & Features */}
          <div className="md:col-span-7 space-y-8 text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-300 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              Classroom gamification
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Make Learning <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                Truly Awesome!
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
              Host exciting real-time multiplayer quizzes in your classroom. Auto-generate quizzes instantly from PDF lecture notes using state-of-the-art AI.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 max-w-lg pt-4">
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition">
                <span className="text-2xl mb-2 block">🤖</span>
                <h3 className="font-bold text-slate-200">AI PDF Import</h3>
                <p className="text-xs text-slate-400 mt-1">Upload lecture PDFs to auto-generate matching questions.</p>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition">
                <span className="text-2xl mb-2 block">⚡</span>
                <h3 className="font-bold text-slate-200">Real-Time Fun</h3>
                <p className="text-xs text-slate-400 mt-1">Students play live together with leaderboards & podiums.</p>
              </div>
            </div>
          </div>

          {/* Right: Tactile Student Join Box */}
          <div className="md:col-span-5 flex justify-center animate-scale-up">
            <div className="w-full max-w-md bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative">
              {/* Floating glow decoration behind card */}
              <div className="absolute inset-0 -z-10 rounded-3xl bg-purple-500/10 blur-xl"></div>
              
              <div className="text-center space-y-2 mb-8">
                <span className="text-4xl">🎮</span>
                <h2 className="text-2xl font-black tracking-tight text-slate-100">Ready to Play?</h2>
                <p className="text-sm text-slate-400">Enter the game pin provided by your instructor</p>
              </div>

              <form onSubmit={handleJoinGame} className="space-y-6">
                <div>
                  <input
                    type="text"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-Digit PIN"
                    className="w-full text-center text-3xl font-black tracking-[0.2em] py-4 rounded-2xl border-2 border-slate-700 bg-slate-900 text-white focus:border-purple-500 focus:outline-none placeholder:tracking-normal placeholder:text-lg uppercase transition-all duration-200"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-4 text-base tracking-widest font-black"
                >
                  🚀 JOIN GAME
                </Button>
              </form>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 text-center text-xs text-slate-500 relative z-10">
        <p>© {new Date().getFullYear()} Classroom Quest. Built for educators and students everywhere.</p>
      </footer>
    </div>
  )
}