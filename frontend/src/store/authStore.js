import { create } from 'zustand'
import { authService } from '../services/authService'

export const useAuthStore = create((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),

  login: async (email, password) => {
    const data = await authService.login(email, password)
    set({ user: data.user, isAuthenticated: true })
    return data
  },

  register: async (name, email, password, role) => {
    const data = await authService.register(name, email, password, role)
    set({ user: data.user, isAuthenticated: true })
    return data
  },

  logout: () => {
    authService.logout()
    set({ user: null, isAuthenticated: false })
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user })
  }
}))