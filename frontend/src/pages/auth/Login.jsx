import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import Input from '../../components/shared/Input'
import Button from '../../components/shared/Button'
import toast from 'react-hot-toast'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT'
  })
  const [loading, setLoading] = useState(false)

  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        toast.success('Welcome back!')
      } else {
        await register(formData.name, formData.email, formData.password, formData.role)
        toast.success('Account created successfully!')
      }
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Something went wrong')
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

      {/* Floating Logo / Home button */}
      <div className="absolute top-6 left-6 z-20">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-2xl">🎓</span>
          <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400">
            CLASSROOM QUEST
          </span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10 animate-scale-up">
        {/* Floating glow decoration behind card */}
        <div className="absolute inset-0 -z-10 rounded-3xl bg-purple-500/10 blur-xl"></div>

        <div className="text-center mb-8">
          <span className="text-3xl inline-block mb-3">🔑</span>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-400 text-sm">
            {isLogin ? 'Sign in to continue your adventure' : 'Join the classroom quest today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-white focus:border-purple-500 focus:outline-none transition-all duration-200"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@school.edu"
              className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-white focus:border-purple-500 focus:outline-none transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-white focus:border-purple-500 focus:outline-none transition-all duration-200"
              required
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">I am a...</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:border-purple-500 focus:outline-none transition-all duration-200"
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
              </select>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full py-3.5 mt-6 tracking-wider font-extrabold"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 font-extrabold hover:text-purple-300 hover:underline transition"
            >
              {isLogin ? 'Register now' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}