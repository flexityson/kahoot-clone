import { Link } from 'react-router-dom'
import Button from '../../components/shared/Button'

export default function StudentHome() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">Student Dashboard</h1>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Play?</h2>
          <p className="text-gray-600 mb-8">Enter a game PIN to join a quiz</p>
          <Link to="/join">
            <Button>Join Game</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}