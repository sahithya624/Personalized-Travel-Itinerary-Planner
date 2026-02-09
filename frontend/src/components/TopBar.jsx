import React from 'react'
import { Search, Bell, User } from 'lucide-react'

export const TopBar = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{"full_name": "Traveler"}')

    return (
        <div className="h-20 bg-white/50 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search trips, destinations, or bookings..."
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <button className="relative p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white" />
                </button>

                <div className="h-10 w-px bg-gray-100 mx-2" />

                <div className="flex items-center space-x-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">{user.full_name}</p>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest leading-none">Explorer</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary-dark ring-4 ring-secondary/5 group-hover:ring-secondary/10 transition-all">
                        <User className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
    )
}
