import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tripsAPI } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  MapPin,
  Calendar,
  Users,
  Trash2,
  TrendingUp,
  Clock,
  Compass,
  ArrowRight,
  Archive,
  Share2
} from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { TopBar } from '../components/TopBar'
import { getPlaceImage } from '../utils/placeImages'

export const Dashboard = () => {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      const response = await tripsAPI.getTrips()
      setTrips(response.data || [])
    } catch (error) {
      console.error('Failed to fetch trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteTrip = async (tripId, e) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this trip?')) return

    try {
      await tripsAPI.deleteTrip(tripId)
      setTrips(trips.filter(t => t.id !== tripId))
    } catch (error) {
      console.error('Failed to delete trip:', error)
    }
  }

  const filteredTrips = trips.filter(trip => {
    if (activeTab === 'All') return true
    if (activeTab === 'Archived') return trip.is_archived
    if (activeTab === 'Shared') return trip.is_shared
    return true
  })

  const stats = [
    { label: 'Total Trips', value: trips.length, icon: <Compass className="w-5 h-5" />, color: 'bg-primary/10 text-primary' },
    { label: 'Destinations', value: [...new Set(trips.map(t => t.destination))].length, icon: <MapPin className="w-5 h-5" />, color: 'bg-secondary/10 text-secondary-dark' },
    { label: 'Upcoming', value: trips.filter(t => new Date(t.start_date) > new Date()).length, icon: <Calendar className="w-5 h-5" />, color: 'bg-accent/10 text-accent-dark' },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-72">
        <TopBar />

        <div className="p-8 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div>
              <p className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-2">Workspace</p>
              <h1 className="text-4xl font-extrabold text-text-main tracking-tight">Overview</h1>
            </div>
            <button
              onClick={() => navigate('/create-trip')}
              className="btn-primary"
            >
              <Plus className="w-5 h-5" /> Start New Trip
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-premium p-6 flex items-center gap-5"
              >
                <div className={`w - 12 h - 12 ${stat.color} rounded - 2xl flex items - center justify - center`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-text-main leading-none">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trips Content */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-main">Your Itineraries</h2>
            <div className="flex gap-2">
              {['All', 'Shared', 'Archived'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px - 5 py - 2 text - xs font - bold rounded - full transition - all duration - 300 ${activeTab === tab
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                    : 'bg-white text-text-muted border border-gray-100 hover:border-primary/20 hover:text-primary shadow-sm'
                    } `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-50 rounded-[2rem] animate-pulse" />
              ))}
            </div>
          ) : filteredTrips.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-premium p-16 text-center border-dashed border-2 border-gray-200 bg-white/50 backdrop-blur-sm"
            >
              <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                {activeTab === 'Archived' ? <Archive className="w-10 h-10" /> : activeTab === 'Shared' ? <Share2 className="w-10 h-10" /> : <MapPin className="w-10 h-10" />}
              </div>
              <h3 className="text-2xl font-bold text-text-main mb-2">No {activeTab.toLowerCase()} trips found</h3>
              <p className="text-text-muted mb-8 max-w-xs mx-auto">
                {activeTab === 'All'
                  ? "Your travel map is empty. Let's start by planning your first grand adventure."
                  : activeTab === 'Archived'
                    ? "You haven't archived any trips yet. Keep your workspace clean by moving past trips here."
                    : "Collaborate with friends to see shared itineraries here."}
              </p>
              {activeTab === 'All' && (
                <button
                  onClick={() => navigate('/create-trip')}
                  className="btn-secondary"
                >
                  Create My First Itinerary
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode='popLayout'>
                {filteredTrips.map((trip, idx) => (
                  <motion.div
                    key={trip.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="card-premium overflow-hidden group cursor-pointer"
                    onClick={() => navigate(`/ trip / ${trip.id} `)}
                  >
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={getPlaceImage(trip.destination)}
                        alt={trip.destination}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={(e) => deleteTrip(trip.id, e)}
                          className="p-2 bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 rounded-xl transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                          {trip.preferences.pace || 'Moderate'}
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-text-main mb-4 group-hover:text-primary transition-colors italic">{trip.destination}</h3>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-xs font-bold text-text-muted">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-text-muted">
                          <Users className="w-4 h-4 text-primary" />
                          <span>{trip.preferences.group_size} travelers</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-secondary-dark font-black text-lg">₹</span>
                          <span className="text-sm font-black text-text-main">{trip.preferences.budget_per_day_inr} <span className="text-text-muted font-normal text-xs uppercase tracking-tighter">/ day</span></span>
                        </div>
                        <div className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

