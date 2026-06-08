import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Button from '../components/shared/Button'

export default function Home() {
  const { isAuthenticated, user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900">
      <nav className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Kahoot Clone</h1>
        <div>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-white">Hi, {user?.name}</span>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </nav>

      <main className="flex items-center justify-center text-center p-8">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-bold text-white mb-6">
            Make Learning Awesome!
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Create quizzes, host live games, and make your classroom more engaging.
          </p>
          <div className="flex gap-4 justify-center">
            {isAuthenticated ? (
              user?.role === 'TEACHER' ? (
                <Link to="/teacher">
                  <Button variant="secondary">Go to Dashboard</Button>
                </Link>
              ) : (
                <Link to="/join">
                  <Button variant="secondary">Join a Game</Button>
                </Link>
              )
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary">Login</Button>
                </Link>
                <Link to="/join">
                  <Button variant="outline">Join Game</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}