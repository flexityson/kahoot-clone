import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizService } from '../../services/quizService'
import Button from '../../components/shared/Button'
import Input from '../../components/shared/Input'
import toast from 'react-hot-toast'

export default function TeacherCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [{
      content: '',
      timeLimit: 20,
      points: 1000,
      options: [
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false }
      ]
    }]
  })

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, {
        content: '',
        timeLimit: 20,
        points: 1000,
        options: Array(4).fill({ content: '', isCorrect: false })
      }]
    })
  }

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...formData.questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setFormData({ ...formData, questions: newQuestions })
  }

  const updateOption = (qIndex, oIndex, field, value) => {
    const newQuestions = [...formData.questions]
    newQuestions[qIndex].options[oIndex] = {
      ...newQuestions[qIndex].options[oIndex],
      [field]: value
    }
    setFormData({ ...formData, questions: newQuestions })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await quizService.createQuiz(formData)
      toast.success('Quiz created!')
      navigate('/teacher/quizzes')
    } catch (error) {
      toast.error('Failed to create quiz')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">Create Quiz</h1>
          <Button variant="outline" onClick={() => navigate('/teacher/quizzes')}>Back</Button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Quiz Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter quiz title"
            required
          />

          <Input
            label="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your quiz"
          />

          <div className="space-y-6">
            {formData.questions.map((q, qIdx) => (
              <div key={qIdx} className="bg-white rounded-xl p-6 shadow">
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
                  placeholder="Enter your question"
                  required
                />

                <div className="mt-4 space-y-2">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex gap-2 items-center">
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
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button type="button" variant="secondary" onClick={addQuestion} className="w-full">
            + Add Question
          </Button>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Quiz'}
          </Button>
        </form>
      </main>
    </div>
  )
}