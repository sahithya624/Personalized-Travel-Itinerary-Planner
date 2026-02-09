import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MapPin, Search, Grid, List as ListIcon, Trash2, ArrowRight, Map as MapIcon, Compass } from 'lucide-react'
import { tripsAPI } from '../services/api'
import { Sidebar } from '../components/Sidebar'
import { TopBar } from '../components/TopBar'

export const SavedPlaces = () => {
    const [places, setPlaces] = useState([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

    useEffect(() => {
        fetchSavedPlaces()
    }, [])

    const fetchSavedPlaces = async () => {
        try {
            setLoading(true)
            const response = await tripsAPI.getSavedPlaces()
            setPlaces(response.data)
        } catch (err) {
            console.error('Failed to fetch saved places:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <main className="flex-1 ml-72">
                <TopBar />

                <div className="p-8 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-pink-100 text-pink-600 rounded-xl shadow-sm">
                                    <Heart className="w-4 h-4 fill-pink-600" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-600">Travel Bucket List</span>
                            </div>
                            <h1 className="text-5xl font-extrabold text-text-main tracking-tight leading-none">Saved Places</h1>
                        </div>

                        <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                <ListIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-64 bg-gray-50 rounded-[2rem] animate-pulse" />
                            ))}
                        </div>
                    ) : places.length === 0 ? (
                        <div className="text-center py-32 card-premium bg-white/50 backdrop-blur-md border-dashed border-2 border-gray-200">
                            <div className="w-24 h-24 bg-pink-50 text-pink-200 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Heart className="w-12 h-12" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-text-main mb-4 tracking-tight">Your bucket list is empty</h2>
                            <p className="text-text-muted text-lg max-w-md mx-auto mb-10">Start planning a trip or explore trending destinations to find places worth saving.</p>
                            <div className="flex justify-center gap-4">
                                <button className="btn-primary py-4 px-10">Discover Places</button>
                                <button className="btn-secondary py-4 px-10 shadow-none border border-gray-100">Plan Custom Trip</button>
                            </div>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
                            <AnimatePresence mode='popLayout'>
                                {places.map((place, idx) => (
                                    <motion.div
                                        key={place.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`card-premium overflow-hidden group ${viewMode === 'list' ? 'flex items-center gap-8 p-6' : ''}`}
                                    >
                                        <div className={`${viewMode === 'list' ? 'w-24 h-24' : 'h-48'} overflow-hidden relative rounded-2xl`}>
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                                <MapPin className="w-8 h-8 text-primary" />
                                            </div>
                                            <div className="absolute top-3 left-3">
                                                <div className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-lg text-[8px] font-black uppercase tracking-widest text-primary italic">
                                                    AI Recommended
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`flex-1 ${viewMode === 'grid' ? 'p-6' : ''}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-text-main leading-tight italic">{place.name}</h3>
                                                <button className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-text-muted mb-6 leading-relaxed line-clamp-2">{place.description}</p>

                                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                                                        <MapIcon className="w-3.5 h-3.5 text-text-muted" />
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">{place.location_type || 'Point of Interest'}</p>
                                                </div>
                                                <button className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                                    <ArrowRight className="w-5 h-5" />
                                                </button>
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
