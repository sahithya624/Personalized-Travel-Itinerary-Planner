import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    PlusCircle,
    LogOut,
    Globe,
    Compass,
    Heart,
    History,
    Sparkles,
    ShieldCheck,
    X
} from 'lucide-react'

export const Sidebar = () => {
    const location = useLocation()
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)

    const menuItems = [
        { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
        { icon: <PlusCircle className="w-5 h-5" />, label: 'Plan New Trip', path: '/create-trip' },
        { icon: <Compass className="w-5 h-5" />, label: 'Explore', path: '/explore' },
        { icon: <Heart className="w-5 h-5" />, label: 'Saved Places', path: '/saved-places' },
        { icon: <History className="w-5 h-5" />, label: 'Trip History', path: '/history' },
    ]

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/'
    }

    return (
        <>
            <div className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-40">
                <div className="p-8">
                    <div className="flex items-center space-x-3 mb-10">
                        <div className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
                            <Globe className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Travel<span className="text-primary">Planner</span></span>
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item, idx) => (
                            <Link
                                key={idx}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${location.pathname === item.path
                                    ? 'bg-primary/10 text-primary font-bold shadow-sm shadow-primary/5'
                                    : 'text-text-muted hover:bg-gray-50'
                                    }`}
                            >
                                <div className={location.pathname === item.path ? 'text-primary' : 'text-gray-400 group-hover:text-primary transition-colors'}>
                                    {item.icon}
                                </div>
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-8 space-y-4">
                    <div className="bg-primary/5 rounded-3xl p-6 relative overflow-hidden group border border-primary/10">
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                        <p className="text-xs font-black text-primary mb-2 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" /> UPGRADE TO PRO
                        </p>
                        <p className="text-sm font-bold text-text-main mb-4 leading-snug">Get unlimited AI planning and offline maps.</p>
                        <button
                            onClick={() => setShowUpgradeModal(true)}
                            className="w-full py-2.5 bg-primary text-white text-xs font-black rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-95"
                        >
                            Upgrade Now
                        </button>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-text-muted hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-bold">Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Upgrade Modal */}
            <AnimatePresence>
                {showUpgradeModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowUpgradeModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden"
                        >
                            <div className="p-8 sm:p-12 text-center">
                                <button
                                    onClick={() => setShowUpgradeModal(false)}
                                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-text-main hover:bg-gray-100 rounded-full transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                                    <Sparkles className="w-10 h-10" />
                                </div>

                                <h3 className="text-3xl font-black text-text-main mb-4 leading-tight italic">Experience TravelPlanner Pro</h3>
                                <p className="text-text-muted font-medium mb-10 leading-relaxed">Unlock the full potential of AI-driven travel planning with our premium subscription.</p>

                                <div className="space-y-4 mb-10">
                                    {[
                                        'Unlimited AI Itinerary Generations',
                                        'High-Priority GPT-4 Processing',
                                        'Offline Map Exports & PDF Guides',
                                        'Real-time Flight & Hotel Alerts'
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-left p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span className="text-sm font-bold text-text-main">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full btn-primary py-4 px-10 text-lg shadow-xl shadow-primary/20">
                                    Start 7-Day Free Trial
                                </button>
                                <p className="mt-6 text-xs font-bold text-text-muted uppercase tracking-widest">Then ₹799 / month · Cancel anytime</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
