import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Clock, FileText, Calendar, PlusCircle, ArrowRight, Activity, Trash2, Search, Filter } from 'lucide-react'
import { tripsAPI } from '../services/api'
import { Sidebar } from '../components/Sidebar'
import { TopBar } from '../components/TopBar'

export const TripHistory = () => {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            setLoading(true)
            const response = await tripsAPI.getHistory()
            setHistory(response.data)
        } catch (err) {
            console.error('Failed to fetch history:', err)
        } finally {
            setLoading(false)
        }
    }

    const getActionColor = (action) => {
        switch (action) {
            case 'CREATE_TRIP': return 'bg-green-100 text-green-700'
            case 'GENERATE_ITINERARY': return 'bg-primary/10 text-primary'
            case 'DELETE_TRIP': return 'bg-red-100 text-red-700'
            case 'LOGIN': return 'bg-indigo-100 text-indigo-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const formatAction = (action) => {
        return action.replace('_', ' ').toLowerCase()
    }

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <main className="flex-1 ml-72">
                <TopBar />

                <div className="p-8 max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm">
                                    <History className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Audit & Log</span>
                            </div>
                            <h1 className="text-5xl font-extrabold text-text-main tracking-tight leading-none">Trip Activity</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Filter activity..."
                                    className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 text-sm font-medium"
                                />
                            </div>
                            <button className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-400">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-24 bg-gray-50 rounded-3xl animate-pulse" />
                            ))}
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-20 card-premium">
                            <Activity className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-text-muted font-bold italic">No recent activity detected.</p>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-100 hidden sm:block" />

                            <div className="space-y-8">
                                {history.map((log, idx) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="relative pl-0 sm:pl-16 group"
                                    >
                                        {/* Timeline Dot */}
                                        <div className="absolute left-5 top-1.5 w-3 h-3 rounded-full bg-white border-4 border-gray-200 group-hover:border-primary transition-colors hidden sm:block z-10" />

                                        <div className="card-premium p-6 hover:shadow-xl transition-all border-none shadow-sm hover:translate-x-1 duration-300">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getActionColor(log.action)}`}>
                                                        {formatAction(log.action)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-text-main leading-tight italic">
                                                            {log.details?.destination || log.entity_type || 'Activity log'}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Clock className="w-3 h-3 text-text-muted" />
                                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">
                                                                {new Date(log.created_at).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest hover:translate-x-1 transition-transform group-hover:opacity-100 opacity-0">
                                                    Details <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {log.details && Object.keys(log.details).length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                    {Object.entries(log.details).map(([key, value]) => (
                                                        <div key={key}>
                                                            <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-1">{key}</p>
                                                            <p className="text-xs font-bold text-text-main truncate capitalize">{value.toString()}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
