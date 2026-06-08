import { create } from 'zustand'

export const useQuizStore = create((set) => ({
  quizzes: [],
  currentQuiz: null,

  setQuizzes: (quizzes) => set({ quizzes }),

  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),

  addQuiz: (quiz) => set((state) => ({ quizzes: [quiz, ...state.quizzes] })),

  updateQuiz: (updatedQuiz) => set((state) => ({
    quizzes: state.quizzes.map(q => q.id === updatedQuiz.id ? updatedQuiz : q)
  })),

  removeQuiz: (id) => set((state) => ({
    quizzes: state.quizzes.filter(q => q.id !== id)
  })),

  resetCurrentQuiz: () => set({ currentQuiz: null })
}))