import api from './api'

export const sessionService = {
  createSession: async (quizId) => {
    const { data } = await api.post('/session', { quizId })
    return data.session
  },

  getSessionByPin: async (pin) => {
    const { data } = await api.get(`/session/pin/${pin}`)
    return data.session
  },

  getSession: async (id) => {
    const { data } = await api.get(`/session/${id}`)
    return data.session
  },

  getLeaderboard: async (sessionId) => {
    const { data } = await api.get(`/session/${sessionId}/leaderboard`)
    return data.leaderboard
  }
}