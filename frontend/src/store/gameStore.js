import { create } from 'zustand'

export const useGameStore = create((set) => ({
  currentSession: null,
  player: null,
  gameState: 'waiting',
  currentQuestion: null,
  questionIndex: 0,
  totalQuestions: 0,
  leaderboard: [],
  finalResults: [],

  setSession: (session) => set({ currentSession: session }),

  setPlayer: (player) => set({ player }),

  setGameState: (state) => set({ gameState: state }),

  setCurrentQuestion: (question, index, total) => set({
    currentQuestion: question,
    questionIndex: index,
    totalQuestions: total
  }),

  setLeaderboard: (leaderboard) => set({ leaderboard }),

  setFinalResults: (results) => set({ finalResults: results }),

  resetGame: () => set({
    currentSession: null,
    player: null,
    gameState: 'waiting',
    currentQuestion: null,
    questionIndex: 0,
    totalQuestions: 0,
    leaderboard: [],
    finalResults: []
  })
}))