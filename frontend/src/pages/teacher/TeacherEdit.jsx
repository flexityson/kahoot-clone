import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { quizService } from '../../services/quizService'
import Button from '../../components/shared/Button'
import Input from '../../components/shared/Input'
import Loader from '../../components/shared/Loader'
import toast from 'react-hot-toast'

export default function TeacherEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [quiz, setQuiz] = useState(null)

  useEffect(() => {
    loadQuiz()
  }, [id])

  const loadQuiz = async () => {
    try {
      const data = await quizService.getQuiz(id)
      setQuiz(data)
    } catch (error) {
      toast.error('Failed to load quiz')
      navigate('/teacher/quizzes')
    } finally {
      setLoading(false)
    }
  }

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...quiz.questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setQuiz({ ...quiz, questions: newQuestions })
  }

  const updateOption = (qIndex, oIndex, field, value) => {
    const newQuestions = [...quiz.questions]
    newQuestions[qIndex].options[oIndex] = {
      ...newQuestions[qIndex].options[oIndex],
      [field]: value
    }
    setQuiz({ ...quiz, questions: newQuestions })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await quizService.updateQuestions(id, quiz.questions)
      toast.success('Quiz updated!')
    } catch (error) {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader size="large" />
      </div>
    )
  }

  if (!quiz) return null

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">Edit Quiz</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/teacher/quizzes')}>Back</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-8">
        <Input
          label="Quiz Title"
          value={quiz.title}
          onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
        />

        <div className="space-y-6 mt-6">
          {quiz.questions.map((q, qIdx) => (
            <div key={q.id || qIdx} className="bg-white rounded-xl p-6 shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Question {qIdx + 1}</h3>
                <div className="flex gap-4">
                  <label className="text-sm">
                    Time:
                    <input
                      type="number"
                      value={q.timeLimit}
                      onChange={(e) => updateQuestion(qIdx, 'timeLimit', parseInt(e.target.value))}
                      className="ml-2 w-20 px-2 py-1 border rounded"
                    />s
                  </label>
                  <label className="text-sm">
                    Points:
                    <input
                      type="number"
                      value={q.points}
                      onChange={(e) => updateQuestion(qIdx, 'points', parseInt(e.target.value))}
                      className="ml-2 w-20 px-2 py-1 border rounded"
                    />
                  </label>
                </div>
              </div>

              <Input
                value={q.content}
                onChange={(e) => updateQuestion(qIdx, 'content', e.target.value)}
                placeholder="Question text"
              />

              <div className="mt-4 space-y-2">
                {q.options.map((opt, oIdx) => (
                  <div key={opt.id || oIdx} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      checked={opt.isCorrect}
                      onChange={() => {
                        const newOptions = q.options.map((o, i) => ({
                          ...o,
                          isCorrect: i === oIdx
                        }))
                        updateQuestion(qIdx, 'options', newOptions)
                      }}
                      className="w-4 h-4"
                    />
                    <input
                      type="text"
                      value={opt.content}
                      onChange={(e) => updateOption(qIdx, oIdx, 'content', e.target.value)}
                      placeholder={`Option ${oIdx + 1}`}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}