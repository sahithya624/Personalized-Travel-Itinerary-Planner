import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Compass,
    Star,
    MapPin,
    Globe,
    ArrowRight,
    Sparkles,
    Flame,
    TrendingUp,
    X,
    Clock,
    Camera,
    Navigation,
    Info
} from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { TopBar } from '../components/TopBar'
import { getPlaceHeroImage } from '../utils/placeImages'

export const Explore = () => {
    const navigate = useNavigate()
    const [activeCategory, setActiveCategory] = useState('All')
    const [selectedPlace, setSelectedPlace] = useState(null)

    const trendingDestinations = [
        {
            id: 1,
            name: 'Goa, India',
            category: 'Tropical',
            image: 'https://images.unsplash.com/photo-1512789674581-862f3a42b130?auto=format&fit=crop&w=1200&q=80',
            rating: 4.8,
            reviews: '12k',
            price: '₹₹',
            vibe: 'Beach',
            description: 'The beach capital of India. Goa offers a perfect blend of sun-kissed beaches, vibrant nightlife, and Portuguese-inspired architecture.',
            highlights: ['Baga Beach Party', 'Old Goa Churches', 'Anjuna Flea Market'],
            bestTime: 'November to February',
            budgetHint: '₹5,000+ / day'
        },
        {
            id: 2,
            name: 'Jaipur, India',
            category: 'Heritage',
            image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
            rating: 4.9,
            reviews: '8.5k',
            price: '₹₹',
            vibe: 'Cultural',
            description: 'The Pink City. Jaipur is famous for its majestic palaces, historic forts, and colorful bazaars that showcase the royalty of Rajasthan.',
            highlights: ['Hawa Mahal', 'Amer Fort', 'Chokhi Dhani Dinner'],
            bestTime: 'October to March',
            budgetHint: '₹4,000 / day'
        },
        {
            id: 3,
            name: 'Leh Ladakh, India',
            category: 'Adventure',
            image: 'https://images.unsplash.com/photo-1581791534721-e599df440811?auto=format&fit=crop&w=1200&q=80',
            rating: 4.9,
            reviews: '5k',
            price: '₹₹₹',
            vibe: 'Mountain',
            description: 'A high-altitude desert known for its stunning landscapes, turquoise lakes, and ancient Buddhist monasteries.',
            highlights: ['Pangong Lake', 'Khardung La Pass', 'Shanti Stupa'],
            bestTime: 'May to September',
            budgetHint: '₹7,000 / day'
        },
        {
            id: 4,
            name: 'Manali, India',
            category: 'Nature',
            image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
            rating: 4.7,
            reviews: '15k',
            price: '₹₹',
            vibe: 'Mountain',
            description: 'A popular hill station in the Himalayas, offering snow-capped peaks, apple orchards, and a gateway to adventure sports.',
            highlights: ['Rohtang Pass', 'Solang Valley Skii', 'Old Manali Cafes'],
            bestTime: 'March to June',
            budgetHint: '₹3,500 / day'
        },
        {
            id: 5,
            name: 'Mumbai, India',
            category: 'Metropolitan',
            image: 'https://images.unsplash.com/photo-1570160897040-fb42eaddf4ec?auto=format&fit=crop&w=1200&q=80',
            rating: 4.8,
            reviews: '25k',
            price: '₹₹₹',
            vibe: 'City',
            description: 'The City of Dreams. India\'s financial capital known for Bollywood, the iconic Gateway of India, and its legendary street food.',
            highlights: ['Marine Drive', 'Gateway of India', 'Chhatrapati Shivaji Terminus'],
            bestTime: 'November to March',
            budgetHint: '₹6,000 / day'
        },
        {
            id: 6,
            name: 'Varanasi, India',
            category: 'Spiritual',
            image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1200&q=80',
            rating: 4.9,
            reviews: '6k',
            price: '₹',
            vibe: 'Cultural',
            description: 'One of the oldest living cities in the world. Varanasi is the spiritual heart of India, famous for its ghats along the Ganges.',
            highlights: ['Ganga Aarti', 'Kashi Vishwanath Temple', 'Sarnath Tour'],
            bestTime: 'November to February',
            budgetHint: '₹2,500 / day'
        },
        {
            id: 7,
            name: 'Udaipur, India',
            category: 'Romantic',
            image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
            rating: 4.8,
            reviews: '7k',
            price: '₹₹₹',
            vibe: 'Cultural',
            description: 'The City of Lakes. Known for its sophisticated lakefront palaces and being one of the most romantic spots in India.',
            highlights: ['Lake Pichola Boat Ride', 'City Palace', 'Jag Mandir'],
            bestTime: 'September to March',
            budgetHint: '₹8,000 / day'
        },
        {
            id: 8,
            name: 'Delhi, India',
            category: 'Historic',
            image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
            rating: 4.7,
            reviews: '30k',
            price: '₹₹',
            vibe: 'Food',
            description: 'A food lover\'s paradise. Delhi offers an incredible journey from Old Delhi\'s street food to fine dining in the capital.',
            highlights: ['Chandni Chowk Food Walk', 'Red Fort', 'Qutub Minar'],
            bestTime: 'October to March',
            budgetHint: '₹3,000 / day'
        },
        {
            id: 9,
            name: 'Bengaluru, India',
            category: 'Tech City',
            image: 'https://images.unsplash.com/photo-1596402184320-417d717867cd?auto=format&fit=crop&w=1200&q=80',
            rating: 4.6,
            reviews: '18k',
            price: '₹₹',
            vibe: 'Nightlife',
            description: 'The Pub Capital of India. Known for its pleasant weather, tech industry, and a thriving craft beer scene.',
            highlights: ['MG Road Pub Crawl', 'Lalbagh Botanical Garden', 'Cubbon Park'],
            bestTime: 'Throughout the year',
            budgetHint: '₹4,500 / day'
        },
        {
            id: 10,
            name: 'Kerala (Munnar), India',
            category: 'Serene',
            image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
            rating: 4.9,
            reviews: '10k',
            price: '₹₹',
            vibe: 'Nature',
            description: 'God\'s Own Country. Munnar is famous for its sprawling tea plantations, misty hills, and tranquil atmosphere.',
            highlights: ['Tea Garden Tour', 'Eravikulam National Park', 'Mattupetty Dam'],
            bestTime: 'September to March',
            budgetHint: '₹4,000 / day'
        },
        {
            id: 11,
            name: 'Rishikesh, India',
            category: 'Adventure',
            image: 'https://images.unsplash.com/photo-1588693951525-6b79732777f9?auto=format&fit=crop&w=1200&q=80',
            rating: 4.8,
            reviews: '9k',
            price: '₹',
            vibe: 'Adventure',
            description: 'The Yoga Capital of the World and a hub for white-water rafting on the Ganges.',
            highlights: ['River Rafting', 'Laxman Jhula', 'The Beatles Ashram'],
            bestTime: 'March to May & September to November',
            budgetHint: '₹2,000 / day'
        }
    ]

    const categories = [
        { label: 'All', icon: '✨' },
        { label: 'Beach', icon: '🏖️' },
        { label: 'Mountain', icon: '⛰️' },
        { label: 'City', icon: '🏙️' },
        { label: 'Cultural', icon: '⛩️' },
        { label: 'Food', icon: '🥘' },
        { label: 'Nightlife', icon: '🌙' },
        { label: 'Adventure', icon: '🧗' },
        { label: 'Nature', icon: '🌿' }
    ]

    const filteredDestinations = activeCategory === 'All'
        ? trendingDestinations
        : trendingDestinations.filter(d => d.vibe === activeCategory || d.category === activeCategory)

    const handlePlanTrip = (dest = '') => {
        navigate('/create-trip', { state: { destination: dest } })
    }

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <main className="flex-1 ml-72">
                <TopBar />

                <div className="p-8 max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 h-[400px] mb-12 flex items-center px-12 group">
                        <div className="absolute inset-0 opacity-40 group-hover:scale-105 transition-transform duration-[5000ms]">
                            <img src="https://images.unsplash.com/photo-1524492717547-2249978a688b?auto=format&fit=crop&w=2000&q=80" className="w-full h-full object-cover" alt="India Explorer" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />

                        <div className="relative z-10 max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-white/80 text-xs font-bold mb-6 backdrop-blur-md"
                            >
                                <Sparkles className="w-4 h-4 text-primary" /> DISCOVER THE EXTRAORDINARY
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl font-black text-white mb-6 leading-tight tracking-tight"
                            >
                                Explore Incredible <span className="text-primary italic">India.</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-white/60 text-lg font-medium max-w-lg mb-8"
                            >
                                From the Himalayas to the backwaters, find your perfect Indian getaway curated specifically for you.
                            </motion.p>
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                onClick={() => handlePlanTrip()}
                                className="btn-primary py-4 px-10 text-lg shadow-2xl shadow-primary/20"
                            >
                                Plan Custom Trip
                            </motion.button>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-text-main flex items-center gap-3 tracking-tight">
                                <Compass className="w-7 h-7 text-primary" /> Popular Vibe
                            </h2>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                            {categories.map((cat, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    onClick={() => setActiveCategory(cat.label)}
                                    className={`flex-shrink-0 px-8 py-4 rounded-3xl flex items-center gap-3 transition-all font-bold text-sm border ${activeCategory === cat.label
                                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                        : 'bg-white text-text-muted border-gray-100 hover:border-primary/20 hover:shadow-premium'
                                        }`}
                                >
                                    <span className="text-xl">{cat.icon}</span>
                                    <span>{cat.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Trending Grid */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-text-main flex items-center gap-3 tracking-tight">
                                <Flame className="w-7 h-7 text-orange-500" /> Trending Now
                                {activeCategory !== 'All' && <span className="text-sm font-normal text-text-muted ml-2 italic">in {activeCategory}</span>}
                            </h2>
                            <button className="text-primary font-bold text-sm flex items-center gap-2 hover:translate-x-1 transition-transform">
                                View full world map <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                            >
                                {filteredDestinations.length === 0 ? (
                                    <div className="col-span-full py-24 text-center card-premium bg-white/50 border-dashed border-2">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Compass className="w-8 h-8 text-gray-200" />
                                        </div>
                                        <h3 className="text-xl font-bold text-text-main mb-2">No {activeCategory} spots yet</h3>
                                        <p className="text-text-muted font-medium mb-8">Our AI is currently scouting more trending locations for this vibe.</p>
                                        <button
                                            onClick={() => setActiveCategory('All')}
                                            className="text-primary font-bold text-sm underline underline-offset-4"
                                        >
                                            Reset Filter
                                        </button>
                                    </div>
                                ) : (
                                    filteredDestinations.map((dest, i) => (
                                        <motion.div
                                            key={dest.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            whileHover={{ y: -10 }}
                                            onClick={() => setSelectedPlace(dest)}
                                            className="card-premium overflow-hidden group cursor-pointer"
                                        >
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={getPlaceHeroImage(dest.name)}
                                                    onError={(e) => {
                                                        console.error(`Failed to load image for ${dest.name}`);
                                                        e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80';
                                                    }}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    alt={dest.name}
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-xl text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                                                        {dest.category}
                                                    </div>
                                                </div>
                                                <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-xl">
                                                        <TrendingUp className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-bold text-text-main pr-2 truncate italic">{dest.name}</h3>
                                                    <div className="flex items-center gap-1 text-sm font-black text-accent-dark">
                                                        <Star className="w-3 h-3 fill-accent" /> {dest.rating}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                                                    <p className="text-xs font-bold text-text-muted flex items-center gap-1 uppercase tracking-tighter">
                                                        <MapPin className="w-3 h-3 text-primary" /> {dest.reviews} reviews
                                                    </p>
                                                    <p className="text-lg font-black text-text-main leading-none">{dest.price}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Destination Detail Modal */}
            <AnimatePresence>
                {selectedPlace && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPlace(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-[3rem] shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row"
                        >
                            <button
                                onClick={() => setSelectedPlace(null)}
                                className="absolute top-6 right-6 z-10 p-2 bg-white/20 backdrop-blur-md text-white hover:bg-white/40 rounded-full transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="md:w-1/2 h-80 md:h-[600px] relative">
                                <img
                                    src={getPlaceHeroImage(selectedPlace.name)}
                                    onError={(e) => {
                                        console.error(`Failed to load modal image for ${selectedPlace.name}`);
                                        e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80';
                                    }}
                                    className="w-full h-full object-cover"
                                    alt={selectedPlace.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg mb-3 italic">
                                        <TrendingUp className="w-3 h-3" /> Popular Right Now
                                    </div>
                                    <h2 className="text-4xl font-black text-white leading-tight italic">{selectedPlace.name}</h2>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-accent font-black">
                                            <Star className="w-4 h-4 fill-accent" /> {selectedPlace.rating}
                                        </div>
                                        <div className="text-white/60 text-sm font-medium">({selectedPlace.reviews} reviews)</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-8 sm:p-12 overflow-y-auto max-h-[600px]">
                                <div className="space-y-8">
                                    <section>
                                        <div className="flex items-center gap-2 text-primary mb-4 font-black text-xs uppercase tracking-widest">
                                            <Info className="w-4 h-4" /> Overview
                                        </div>
                                        <p className="text-text-muted text-lg leading-relaxed font-medium">
                                            {selectedPlace.description}
                                        </p>
                                    </section>

                                    <div className="grid grid-cols-2 gap-8">
                                        <section>
                                            <div className="flex items-center gap-2 text-primary mb-4 font-black text-xs uppercase tracking-widest">
                                                <Clock className="w-4 h-4" /> Best Time
                                            </div>
                                            <p className="text-text-main font-bold">{selectedPlace.bestTime}</p>
                                        </section>
                                        <section>
                                            <div className="flex items-center gap-2 text-primary mb-4 font-black text-xs uppercase tracking-widest">
                                                <Navigation className="w-4 h-4" /> Avg Budget
                                            </div>
                                            <p className="text-text-main font-bold">{selectedPlace.budgetHint}</p>
                                        </section>
                                    </div>

                                    <section>
                                        <div className="flex items-center gap-2 text-primary mb-4 font-black text-xs uppercase tracking-widest">
                                            <Camera className="w-4 h-4" /> Destinations Highlights
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedPlace.highlights.map((h, i) => (
                                                <div key={i} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-text-main italic">
                                                    # {h}
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <div className="pt-8 border-t border-gray-100">
                                        <button
                                            onClick={() => handlePlanTrip(selectedPlace.name)}
                                            className="w-full btn-primary py-4 px-10 text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                                        >
                                            <Sparkles className="w-5 h-5" /> Start Planning This Trip
                                        </button>
                                        <p className="mt-4 text-center text-xs font-bold text-text-muted uppercase tracking-widest">
                                            Customize dates, budget, and travel style
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
