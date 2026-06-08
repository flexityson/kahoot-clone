import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/shared/Button'
import toast from 'react-hot-toast'

export default function TeacherHome() {
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between">
      {/* Decorative background shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/60 border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              CLASSROOM QUEST
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="glass" className="py-2 text-xs">View Site</Button>
            </Link>
            <Button variant="danger" onClick={handleLogout} className="py-2 text-xs">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Panel */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12 relative z-10 flex flex-col justify-center gap-8 animate-scale-up">
        
        {/* Welcome Block */}
        <div className="text-left space-y-2 mb-4">
          <span className="text-xs uppercase tracking-widest font-black text-purple-400">Control Panel</span>
          <h1 className="text-4xl font-extrabold text-white">Teacher Dashboard</h1>
          <p className="text-slate-400 text-sm">Welcome back, {user?.name || 'Instructor'}. What would you like to build today?</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-3 gap-6 w-full">
          
          <Link to="/teacher/quizzes">
            <div className="bg-white/[0.03] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.06] p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 group relative">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-purple-500/0 group-hover:bg-purple-500/5 blur-xl transition-all duration-300"></div>
              <div className="text-5xl mb-6">📚</div>
              <h2 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">My Quizzes</h2>
              <p className="text-slate-400 text-sm leading-relaxed">View, edit, organize, and launch all of your created game sessions.</p>
            </div>
          </Link>

          <Link to="/teacher/create">
            <div className="bg-white/[0.03] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.06] p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 group relative">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-purple-500/0 group-hover:bg-purple-500/5 blur-xl transition-all duration-300"></div>
              <div className="text-5xl mb-6">✏️</div>
              <h2 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">Create New</h2>
              <p className="text-slate-400 text-sm leading-relaxed">Build a custom classroom quiz from scratch, setting questions, timers, and points manually.</p>
            </div>
          </Link>

          <Link to="/teacher/pdf-upload">
            <div className="bg-white/[0.03] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.06] p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 group relative">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-purple-500/0 group-hover:bg-purple-500/5 blur-xl transition-all duration-300"></div>
              <div className="text-5xl mb-6">🤖</div>
              <h2 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">AI Generate</h2>
              <p className="text-slate-400 text-sm leading-relaxed">Upload a lecture note PDF to instantly parse and generate quiz questions via Groq AI.</p>
            </div>
          </Link>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-600 relative z-10">
        <p>© Classroom Quest Teacher Dashboard. Managed securely via local storage JWT tokens.</p>
      </footer>
    </div>
  )
}