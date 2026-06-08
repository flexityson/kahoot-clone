import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
      toast.success('Quiz deleted')
    } catch (error) {
      toast.error('Failed to delete quiz')
    }
    setDeleteId(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">My Quizzes</h1>
          <Link to="/teacher">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        {quizzes.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No quizzes yet"
            description="Create your first quiz to get started"
            action={
              <Link to="/teacher/create">
                <Button>Create Quiz</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                <p className="text-gray-600 mb-4">
                  {quiz.totalQuestions} questions • {quiz.status}
                </p>
                <div className="flex gap-2">
                  <Link to={`/teacher/edit/${quiz.id}`}>
                    <Button variant="secondary" className="text-sm py-2">Edit</Button>
                  </Link>
                  <Link to={`/teacher/host/${quiz.id}`}>
                    <Button className="text-sm py-2">Host</Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="text-sm py-2"
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

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Quiz"
        message="Are you sure you want to delete this quiz? This action cannot be undone."
        confirmText="Delete Quiz"
      />
    </div>
  )
}