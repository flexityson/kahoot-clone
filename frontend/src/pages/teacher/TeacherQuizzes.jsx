import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { quizService } from '../../services/quizService'
import { useQuizStore } from '../../store/quizStore'
import Button from '../../components/shared/Button'
import EmptyState from '../../components/shared/EmptyState'
import Loader from '../../components/shared/Loader'
import ConfirmDialog from '../../components/shared/ConfirmDialog'
import toast from 'react-hot-toast'

export default function TeacherQuizzes() {
  const { quizzes, setQuizzes, removeQuiz } = useQuizStore()
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadQuizzes()
  }, [])

  const loadQuizzes = async () => {
    try {
      const data = await quizService.getAllQuizzes()
      setQuizzes(data)
    } catch (error) {
      toast.error('Failed to load quizzes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await quizService.deleteQuiz(deleteId)
      removeQuiz(deleteId)
      toast.success('Quiz deleted successfully')
    } catch (error) {
      toast.error('Failed to delete quiz')
    }
    setDeleteId(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size="large" />
      </div>
    )
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
          <Link to="/teacher">
            <Button variant="glass" className="py-2 text-xs">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Main Quizzes Panel */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12 relative z-10 flex flex-col gap-8 animate-scale-up">
        
        {/* Header Title with action */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest font-black text-purple-400 font-mono">Quiz Inventory</span>
            <h1 className="text-4xl font-extrabold text-white">My Quizzes</h1>
          </div>
          <Link to="/teacher/create">
            <Button variant="primary" className="py-2.5 text-xs font-black tracking-wider">
              ➕ CREATE NEW QUIZ
            </Button>
          </Link>
        </div>

        {/* Quizzes List */}
        {quizzes.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center max-w-md mx-auto w-full space-y-6">
            <span className="text-6xl block">📚</span>
            <h2 className="text-2xl font-black text-white">No Quizzes Found</h2>
            <p className="text-slate-400 text-sm">Create your first game session to start playing with your students.</p>
            <Link to="/teacher/create" className="block">
              <Button variant="primary" className="w-full">Create Quiz</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {quizzes.map((quiz) => (
              <div 
                key={quiz.id} 
                className="bg-white/[0.03] border border-white/10 hover:border-purple-500/30 rounded-3xl p-6 shadow-lg hover:bg-white/[0.05] transition-all duration-300 flex flex-col justify-between h-56 group relative"
              >
                <div>
                  {/* Title and Badge */}
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors truncate pr-2">
                      {quiz.title}
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                      quiz.status === 'PUBLISHED' 
                        ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400' 
                        : 'bg-amber-500/10 border border-amber-500/25 text-amber-400'
                    }`}>
                      {quiz.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-mono mb-4">
                    {quiz.totalQuestions} questions • source: {quiz.source || 'MANUAL'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4">
                  <Link to={`/teacher/edit/${quiz.id}`} className="w-full">
                    <Button variant="secondary" className="w-full text-[10px] py-2 tracking-wider font-extrabold uppercase bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800">
                      Edit
                    </Button>
                  </Link>
                  <Link to={`/teacher/host/${quiz.id}`} className="w-full">
                    <Button variant="primary" className="w-full text-[10px] py-2 tracking-wider font-extrabold uppercase shadow-none">
                      Host
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="w-full text-[10px] py-2 tracking-wider font-extrabold uppercase shadow-none"
                    onClick={() => setDeleteId(quiz.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Quiz"
        message="Are you sure you want to delete this quiz? This action cannot be undone."
        confirmText="Delete Quiz"
      />

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-600 relative z-10">
        <p>© Classroom Quest. Managing local quizzes safely.</p>
      </footer>
    </div>
  )
}