import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tripsAPI } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Loader,
  MapPin,
  Calendar,
  Users,
  Zap,
  Download,
  Edit2,
  ChevronRight,
  Navigation,
  Hotel,
  Coffee,
  Sun,
  Moon,
  Plane,
  Clock,
  Briefcase,
  Sparkles
} from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { TopBar } from '../components/TopBar'
import { getPlaceImage } from '../utils/placeImages'

export const TripView = () => {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [expandedDay, setExpandedDay] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTripData()
  }, [tripId])

  const fetchTripData = async () => {
    try {
      setLoading(true)
      const tripResponse = await tripsAPI.getTrip(tripId)
      setTrip(tripResponse.data)

      try {
        const itineraryResponse = await tripsAPI.getItinerary(tripId)
        setItinerary(itineraryResponse.data)
      } catch {
        setItinerary(null)
      }
    } catch (err) {
      setError('Failed to load trip')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const generateItinerary = async () => {
    setGenerating(true)
    setError('')
    try {
      const response = await tripsAPI.generateItinerary(tripId)
      setItinerary(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate itinerary')
    } finally {
      setGenerating(false)
    }
  }

  const exportPDF = () => {
    if (!itinerary) return
    const content = `${itinerary.destination} Itinerary\n...\n`
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', `${itinerary.destination}-itinerary.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <main className="flex-1 ml-72 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
            <div className="absolute top-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-6 font-bold text-text-muted animate-pulse">Consulting the orbits...</p>
        </main>
      </div>
    )
  }

  if (!trip) return <div className="p-20 text-center">Trip not found</div>

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-72 min-h-screen relative">
        <TopBar />

        <div className="p-8 max-w-6xl mx-auto pb-32">
          {/* Hero Header */}
          <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 h-64 mb-12 flex items-center px-12 group">
            <div className="absolute inset-0 opacity-40">
              <img
                src={getPlaceImage(trip.destination)}
                className="w-full h-full object-cover"
                alt={trip.destination}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />

            <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-colors shadow-sm cursor-pointer text-white">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Live Itinerary</span>
                </div>
                <h1 className="text-5xl font-extrabold text-white tracking-tight leading-none italic">{trip.destination}</h1>
              </div>

              <div className="flex gap-3">
                <button onClick={() => navigate('/create-trip')} className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl text-white hover:bg-white/20 transition-all">
                  <Edit2 className="w-4 h-4" />
                </button>
                {itinerary && (
                  <button onClick={exportPDF} className="btn-primary py-3 px-8 shadow-2xl shadow-primary/20">
                    <Download className="w-4 h-4" /> Export Itinerary
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Stats & Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card-premium p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Duration</p>
                    <p className="text-sm font-bold text-text-main">{trip.start_date} — {trip.end_date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary/10 text-secondary-dark rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Group Size</p>
                    <p className="text-sm font-bold text-text-main">{trip.preferences.group_size} travelers</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent/10 text-accent-dark rounded-xl flex items-center justify-center font-black text-lg">
                    ₹
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Style & Pace</p>
                    <p className="text-sm font-bold text-text-main capitalize">{trip.preferences.travel_style} · {trip.preferences.pace}</p>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-6">Core Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {trip.preferences.interests.map(interest => (
                    <span key={interest} className="px-3 py-1.5 bg-gray-50 text-text-muted rounded-xl text-xs font-bold border border-gray-100 capitalize">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {itinerary && (
                <div className="card-premium p-6 bg-gradient-to-br from-primary to-primary-dark text-white border-none relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -m-10 group-hover:scale-110 transition-transform duration-700" />
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">Total Estimated</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-black">₹</span>
                    <span className="text-4xl font-black">{itinerary.total_estimated_cost.toFixed(0)}</span>
                  </div>
                  <p className="text-[10px] uppercase font-bold opacity-60">Inclusive of all days</p>
                </div>
              )}
            </div>

            {/* Right: Timeline */}
            <div className="lg:col-span-2">
              {!itinerary ? (
                <div className="card-premium p-12 text-center border-dashed border-2 border-primary/20 bg-white/50 backdrop-blur-md h-full flex flex-col justify-center">
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float">
                    <Zap className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-text-main mb-4 tracking-tight">Your itinerary awaits.</h2>
                  <p className="text-text-muted text-lg max-w-sm mx-auto mb-10">Our AI engine is ready to draft a personalized minute-by-minute plan for your {trip.destination} adventure.</p>
                  <button
                    onClick={generateItinerary}
                    disabled={generating}
                    className="btn-primary py-4 px-12 text-lg mx-auto"
                  >
                    {generating ? <Loader className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                    {generating ? 'Building your map...' : 'Generate Itinerary'}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {itinerary.itinerary_days.map((day, idx) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`card-premium overflow-hidden transition-all duration-300 ${expandedDay === day.day ? 'ring-4 ring-primary/5 border-primary/20' : ''}`}
                    >
                      <button
                        onClick={() => setExpandedDay(day.day)}
                        className="w-full text-left flex items-center justify-between p-6"
                      >
                        <div className="flex items-center gap-6">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${expandedDay === day.day ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                            0{day.day}
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">{day.date}</p>
                            <h4 className="text-xl font-bold text-text-main leading-none">Day {day.day} Overview</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black uppercase text-text-muted mb-1">Daily Cap</p>
                            <p className="text-lg font-black text-text-main italic">₹{day.estimated_cost_inr.toFixed(0)}</p>
                          </div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedDay === day.day && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-gray-50 bg-gray-50/30 overflow-hidden"
                          >
                            <div className="p-8 grid md:grid-cols-2 gap-10">
                              <TimelineItem icon={<Sun className="w-5 h-5" />} title="Morning Exploration" content={day.morning} color="text-accent-dark" />
                              <TimelineItem icon={<Navigation className="w-5 h-5" />} title="Afternoon Journey" content={day.afternoon} color="text-primary" />
                              <TimelineItem icon={<Moon className="w-5 h-5" />} title="Evening Charm" content={day.evening} color="text-indigo-600" />
                              <TimelineItem icon={<Coffee className="w-5 h-5" />} title="Cuisine & Dining" content={day.food_recommendations} color="text-secondary-dark" />

                              <div className="md:col-span-2 flex flex-col md:flex-row gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm mt-4">
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-center gap-2 text-primary">
                                    <Hotel className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase tracking-widest leading-none pt-0.5">Stay</span>
                                  </div>
                                  <p className="text-sm font-medium text-text-muted leading-relaxed">{day.accommodation_info}</p>
                                </div>
                                <div className="w-px bg-gray-100 hidden md:block" />
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-center gap-2 text-primary">
                                    <Navigation className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase tracking-widest leading-none pt-0.5">Transit</span>
                                  </div>
                                  <p className="text-sm font-medium text-text-muted leading-relaxed">{day.transport_tips}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function TimelineItem({ icon, title, content, color }) {
  return (
    <div className="space-y-4">
      <div className={`flex items-center gap-3 ${color}`}>
        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
          {icon}
        </div>
        <h5 className="text-xs font-black uppercase tracking-widest text-text-main pt-0.5">{title}</h5>
      </div>
      <p className="text-sm font-medium text-text-muted leading-relaxed pl-3 border-l-2 border-gray-200">
        {content}
      </p>
    </div>
  )
}

