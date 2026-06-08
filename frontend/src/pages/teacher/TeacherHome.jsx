import { Link } from 'react-router-dom'
import Button from '../../components/shared/Button'

export default function TeacherHome() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">Teacher Dashboard</h1>
          <a href="/">
            <Button variant="outline">Back to Home</Button>
          </a>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/teacher/quizzes">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-xl font-bold mb-2">My Quizzes</h2>
              <p className="text-gray-600">View and manage all your quizzes</p>
            </div>
          </Link>

          <Link to="/teacher/create">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">✏️</div>
              <h2 className="text-xl font-bold mb-2">Create New</h2>
              <p className="text-gray-600">Build a quiz from scratch</p>
            </div>
          </Link>

          <Link to="/teacher/pdf-upload">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">🤖</div>
              <h2 className="text-xl font-bold mb-2">AI Generate</h2>
              <p className="text-gray-600">Upload PDF and auto-generate quiz</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}