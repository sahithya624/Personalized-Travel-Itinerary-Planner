import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuthStore } from '../store/store'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowLeft, Globe, Sparkles, Check } from 'lucide-react'

export const Register = () => {
  const navigate = useNavigate()
  const { setToken, setUser } = useAuthStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      // Auto-login after registration
      const loginResponse = await authAPI.login({
        email: formData.email,
        password: formData.password,
      })

      setToken(loginResponse.data.access_token)
      setUser({ id: loginResponse.data.user_id, email: formData.email, name: formData.name })
      localStorage.setItem('token', loginResponse.data.access_token)
      localStorage.setItem('user', JSON.stringify({ id: loginResponse.data.user_id }))

      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    'AI-powered personalized itineraries',
    'Real-time destination insights',
    'Budget-smart travel planning',
    'Unlimited saved adventures'
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Side: Illustration & Branding */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-xs font-bold mb-12 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-secondary" /> JOIN THE FUTURE OF TRAVEL
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-extrabold text-white mb-8 leading-tight"
          >
            Start your <span className="text-secondary italic">limitless</span> exploration today.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/30">
                  <Check className="w-3 h-3 text-secondary" />
                </div>
                <p className="text-white/70 font-medium">{benefit}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-10 h-10 rounded-full border-2 border-slate-900" alt="user" />
                ))}
              </div>
              <p className="text-sm font-bold text-white/60">Joined by <span className="text-white">50,000+</span> travelers</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center mb-12">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="p-2 bg-primary text-white rounded-xl group-hover:bg-primary-dark transition-colors">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight">Travel<span className="text-primary">Planner</span></span>
              </Link>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-extrabold text-text-main tracking-tight">Create your account</h1>
              <p className="text-text-muted font-medium">Join us and start planning your dream trip.</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-text-muted uppercase tracking-widest px-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-bold"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-text-muted uppercase tracking-widest px-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-bold"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-text-muted uppercase tracking-widest px-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-bold text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-text-muted uppercase tracking-widest px-1">Confirm</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-bold text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 px-8 text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 mt-4"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Sparkles className="w-5 h-5" /> Start Journey</>}
              </button>
            </form>

            <div className="pt-8 text-center border-t border-gray-50">
              <p className="text-text-muted font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-bold hover:text-primary-dark transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

