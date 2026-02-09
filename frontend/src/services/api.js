import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/* ======================================================
   REQUEST INTERCEPTOR (token)
====================================================== */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/* ======================================================
   RESPONSE INTERCEPTOR (401 handler)
====================================================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/* ======================================================
   AUTH API
====================================================== */
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
}

/* ======================================================
   TRIPS API  ⭐ FIXED HERE
====================================================== */

const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.id
}

export const tripsAPI = {
  // ✅ automatically attach correct UUID
  createTrip: (data) =>
    api.post('/trips', {
      ...data,
      user_id: getUserId(),
    }),

  getTrips: () =>
    api.get('/trips', {
      params: { user_id: getUserId() },
    }),

  getTrip: (id) =>
    api.get(`/trips/${id}`, {
      params: { user_id: getUserId() },
    }),

  deleteTrip: (id) =>
    api.delete(`/trips/${id}`, {
      params: { user_id: getUserId() },
    }),

  generateItinerary: (tripId) =>
    api.post(`/trips/${tripId}/generate-itinerary`, {
      user_id: getUserId(),
    }),

  getItinerary: (tripId) =>
    api.get(`/trips/${tripId}/itinerary`, {
      params: { user_id: getUserId() },
    }),

  getSavedPlaces: () =>
    api.get('/trips/user/saved-places', {
      params: { user_id: getUserId() },
    }),

  getHistory: () =>
    api.get('/trips/user/history', {
      params: { user_id: getUserId() },
    }),
}

export default api
