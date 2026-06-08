import api from './api'

export const quizService = {
  getAllQuizzes: async () => {
    const { data } = await api.get('/quiz')
    return data.quizzes
  },

  getQuiz: async (id) => {
    const { data } = await api.get(`/quiz/${id}`)
    return data.quiz
  },

  createQuiz: async (quizData) => {
    const { data } = await api.post('/quiz', quizData)
    return data.quiz
  },

  updateQuiz: async (id, quizData) => {
    const { data } = await api.put(`/quiz/${id}`, quizData)
    return data.quiz
  },

  updateQuestions: async (id, questions) => {
    const { data } = await api.put(`/quiz/${id}/questions`, { questions })
    return data.quiz
  },

  deleteQuiz: async (id) => {
    await api.delete(`/quiz/${id}`)
  }
}