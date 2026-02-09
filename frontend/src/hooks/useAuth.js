import { useAuthStore } from '../store/store'
import { useNavigate } from 'react-router-dom'

export const useAuth = () => {
  const navigate = useNavigate()
  const { user, token, isLoading, error, setUser, setToken, setLoading, setError } = useAuthStore()

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      // API call handled in store
      // This is a wrapper for convenience
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    useAuthStore.getState().logout()
    navigate('/login')
  }

  const isAuthenticated = !!token && !!user

  return {
    user,
    token,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated,
    setUser,
    setToken,
  }
}
