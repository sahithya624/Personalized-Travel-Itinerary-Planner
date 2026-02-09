import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { tripsAPI } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Loader,
  MapPin,
  Calendar,
  Users,
  Sparkles,
  CheckCircle2,
  Globe,
  Waves,
  Mountain,
  UtensilsCrossed,
  Palmtree,
  Camera,
  Music
} from 'lucide-react'

export const CreateTrip = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    destination: '',
    start_date: '',
    end_date: '',
    travel_style: 'cultural',
    interests: [],
    group_size: 1,
    pace: 'moderate',
    budget_per_day: 5000,
    dietary_restrictions: [],
    mobility_concerns: '',
  })

  useEffect(() => {
    if (location.state?.destination) {
      setFormData(prev => ({ ...prev, destination: location.state.destination }))
    }
  }, [location])

  const travelStyles = [
    { id: 'luxury', label: 'Luxury', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'backpacking', label: 'Backpacking', icon: <Mountain className="w-5 h-5" /> },
    { id: 'cultural', label: 'Cultural', icon: <Globe className="w-5 h-5" /> },
    { id: 'adventure', label: 'Adventure', icon: <Waves className="w-5 h-5" /> },
    { id: 'romantic', label: 'Romantic', icon: <Palmtree className="w-5 h-5" /> },
  ]

  const interests = [
    { id: 'food', label: 'Food', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <Globe className="w-4 h-4" /> },
    { id: 'nature', label: 'Nature', icon: <Mountain className="w-4 h-4" /> },
    { id: 'art', label: 'Art', icon: <Music className="w-4 h-4" /> },
    { id: 'nightlife', label: 'Nightlife', icon: <Camera className="w-4 h-4" /> },
    { id: 'beaches', label: 'Beaches', icon: <Waves className="w-4 h-4" /> },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckbox = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await tripsAPI.createTrip({
        destination: formData.destination,
        start_date: formData.start_date,
        end_date: formData.end_date,
        preferences: {
          travel_style: formData.travel_style,
          interests: formData.interests,
          group_size: parseInt(formData.group_size),
          pace: formData.pace,
          budget_per_day_inr: parseFloat(formData.budget_per_day),
          dietary_restrictions: formData.dietary_restrictions,
          mobility_concerns: formData.mobility_concerns,
        }
      })

      navigate(`/trip/${response.data.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create trip')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { id: 1, title: 'Basics', description: 'Destination & Dates' },
    { id: 2, title: 'Preferences', description: 'Style & Interests' },
    { id: 3, title: 'Logistics', description: 'Group & Details' }
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 relative flex flex-col">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-bold group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline text-sm">Cancel & Return</span>
        </button>

        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">Travel<span className="text-primary">Planner</span></span>
        </div>

        <div className="w-24" /> {/* Spacer */}
      </header>

      <main className="grow flex flex-col items-center justify-center p-6 md:p-12 relative z-10">
        <div className="max-w-4xl w-full">
          {/* Top Wizard Steps */}
          <div className="flex justify-between mb-12 max-w-2xl mx-auto relative">
            <div className="absolute top-[22px] left-0 w-full h-[2px] bg-gray-100 -z-10" />
            <div
              className="absolute top-[22px] left-0 h-[2px] bg-primary transition-all duration-500 -z-10"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${s.id < step ? 'bg-primary text-white scale-90' :
                    s.id === step ? 'bg-primary text-white shadow-xl shadow-primary/25 scale-110' :
                      'bg-white border border-gray-100 text-gray-300'
                    }`}
                >
                  {s.id < step ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold">{s.id}</span>}
                </div>
                <div className="mt-4 text-center">
                  <p className={`text-xs font-black uppercase tracking-widest ${s.id === step ? 'text-primary' : 'text-gray-400'}`}>{s.title}</p>
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              className="glass p-8 md:p-12 rounded-[3rem] bg-white/80 border-white relative overflow-hidden"
            >
              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold animate-shake">
                  {error}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-10">
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-extrabold text-text-main mb-2">Essential Details</h2>
                    <p className="text-text-muted">Tell us where and when you want to go.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3 col-span-2">
                      <label className="text-xs font-black text-text-muted uppercase tracking-widest px-1">Destination</label>
                      <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                          type="text"
                          name="destination"
                          value={formData.destination}
                          onChange={handleInputChange}
                          className="w-full pl-14 pr-6 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-bold text-lg"
                          placeholder="e.g. Paris, France"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black text-text-muted uppercase tracking-widest px-1">Starting point</label>
                      <div className="relative">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          name="start_date"
                          value={formData.start_date}
                          onChange={handleInputChange}
                          className="w-full pl-14 pr-6 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary/20 transition-all font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black text-text-muted uppercase tracking-widest px-1">End of trip</label>
                      <div className="relative">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          name="end_date"
                          value={formData.end_date}
                          onChange={handleInputChange}
                          className="w-full pl-14 pr-6 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary/20 transition-all font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-10">
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-extrabold text-text-main mb-2">Vibe & Interests</h2>
                    <p className="text-text-muted">Personalize your journey to match your soul.</p>
                  </div>

                  <div className="space-y-6">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest px-1">Travel Style</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {travelStyles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setFormData(p => ({ ...p, travel_style: style.id }))}
                          className={`p-4 rounded-3xl flex flex-col items-center gap-3 transition-all duration-300 border-2 ${formData.travel_style === style.id
                            ? 'bg-primary/5 border-primary text-primary shadow-lg shadow-primary/5 scale-105'
                            : 'bg-white border-gray-100 text-gray-400 hover:border-primary/30'
                            }`}
                        >
                          <div className={formData.travel_style === style.id ? 'text-primary' : ''}>
                            {style.icon}
                          </div>
                          <span className="text-xs font-bold leading-none">{style.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest px-1">Interests (Select any)</label>
                    <div className="flex flex-wrap gap-3">
                      {interests.map((interest) => (
                        <button
                          key={interest.id}
                          onClick={() => handleCheckbox('interests', interest.id)}
                          className={`px-6 py-3 rounded-2xl flex items-center gap-3 transition-all font-bold text-sm ${formData.interests.includes(interest.id)
                            ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            }`}
                        >
                          {interest.icon}
                          {interest.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-10">
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-extrabold text-text-main mb-2">Final Logistics</h2>
                    <p className="text-text-muted">The little things that make it perfect.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-text-muted uppercase tracking-widest px-1">Group size</label>
                      <div className="relative group">
                        <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="group_size"
                          value={formData.group_size}
                          onChange={handleInputChange}
                          className="w-full pl-14 pr-6 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none appearance-none font-bold cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5, 6, 8, 10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black text-text-muted uppercase tracking-widest px-1">Daily Budget (INR)</label>
                      <div className="relative group">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-black text-lg">₹</span>
                        <input
                          type="number"
                          name="budget_per_day"
                          value={formData.budget_per_day}
                          onChange={handleInputChange}
                          className="w-full pl-14 pr-6 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary/20 transition-all font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 col-span-2">
                      <label className="text-xs font-black text-text-muted uppercase tracking-widest px-1">Additional Notes</label>
                      <textarea
                        name="mobility_concerns"
                        value={formData.mobility_concerns}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:outline-none focus:border-primary/20 transition-all font-medium text-sm"
                        placeholder="E.g. Wheelchair access, traveling with pets, or specific allergies..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Navigation */}
              <div className="mt-16 pt-8 border-t border-gray-50 flex items-center justify-between">
                <button
                  onClick={() => setStep(p => Math.max(1, p - 1))}
                  className={`flex items-center gap-2 font-bold transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-text-muted hover:text-text-main'}`}
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>

                {step < 3 ? (
                  <button
                    onClick={() => setStep(p => p + 1)}
                    disabled={step === 1 && !formData.destination}
                    className="btn-primary py-4 px-10 disabled:opacity-50"
                  >
                    Next Step <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-accent py-4 px-12 text-white shadow-xl shadow-accent/30"
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Building...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span>Generate Itinerary</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Progress Footer (Mobile) */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-100 p-4">
        <div className="h-1 w-full bg-gray-100 rounded-full">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

