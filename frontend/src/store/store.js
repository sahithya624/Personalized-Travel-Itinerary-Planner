import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post('/auth/login', credentials)
      const { access_token, user_id } = response.data
      
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify({ id: user_id }))
      
      set({ token: access_token, user: { id: user_id }, isLoading: false })
      return true
    } catch (error) {
      set({ error: error.response?.data?.detail || 'Login failed', isLoading: false })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null, error: null })
  },
}))

const useTripStore = create((set) => ({
  trips: [],
  currentTrip: null,
  itinerary: null,
  isLoading: false,
  error: null,

  setTrips: (trips) => set({ trips }),
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  setItinerary: (itinerary) => set({ itinerary }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))

export { useAuthStore, useTripStore }
