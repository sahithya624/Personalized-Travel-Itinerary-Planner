import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Map, Zap, MapPin, Watch, ShieldCheck, Globe, Star } from 'lucide-react'
import { motion } from 'framer-motion'

export const Landing = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'AI-Powered Planning',
      description: 'Personalized itineraries generated instantly using advanced AI models tailored to your taste.',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Smart Route Optimization',
      description: 'Minimized travel time and maximum experience with algorithmically optimized routes.',
    },
    {
      icon: <span className="text-2xl font-black">₹</span>,
      title: 'Budget-Conscious',
      description: 'Stay within your budget with real-time INR cost estimations and smart recommendations.',
    },
    {
      icon: <Watch className="w-6 h-6" />,
      title: 'Time Management',
      description: 'Perfect pacing for your travel style - choose between relaxed, moderate, or fast tracks.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 inset-x-0 h-[800px] overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-[5%] -right-[5%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass px-6 py-3 rounded-3xl flex justify-between items-center bg-white/40 border-white/40">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-text-main tracking-tight">Travel<span className="text-primary">Planner</span></span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="nav-link">Features</a>
              <a href="#how-it-works" className="nav-link">How it works</a>
              <a href="#testimonials" className="nav-link">Testimonials</a>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login" className="nav-link text-sm font-bold">Sign In</Link>
              <Link to="/register" className="btn-primary py-2 px-5 text-sm shadow-none">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                AI-POWERED EXPLORATION
              </div>
              <h1 className="text-6xl lg:text-7xl font-extrabold text-text-main leading-[1.1] mb-6 tracking-tight">
                Plan your next <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-secondary italic">adventure</span> in seconds.
              </h1>
              <p className="text-lg text-text-muted mb-10 max-w-lg leading-relaxed">
                The most advanced AI travel companion that handles the complexity of planning so you can focus on the experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                  Start Planning Free <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-gray-200 bg-white/50 cursor-pointer hover:bg-white transition-colors">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-medium">
                    <span className="font-bold">2,000+</span> shared trips
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Dashboard Preview Mockup */}
              <div className="relative z-10 p-4 bg-white rounded-[2rem] shadow-2xl border border-gray-100 transform rotate-1 lg:rotate-3 hover:rotate-0 transition-transform duration-700">
                <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-[4/3] relative">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-8">
                      <div className="h-4 w-32 bg-gray-200 rounded-full" />
                      <div className="h-8 w-8 bg-primary/20 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="h-24 bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary/20 mb-3" />
                        <div className="h-2 w-full bg-gray-100 rounded" />
                      </div>
                      <div className="h-24 bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 mb-3" />
                        <div className="h-2 w-full bg-gray-100 rounded" />
                      </div>
                      <div className="h-24 bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/20 mb-3" />
                        <div className="h-2 w-full bg-gray-100 rounded" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-40 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100" />
                          <div className="grow space-y-2">
                            <div className="h-3 w-1/3 bg-gray-200 rounded" />
                            <div className="h-2 w-1/2 bg-gray-100 rounded" />
                          </div>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded mb-2" />
                        <div className="h-2 w-4/5 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute top-1/2 -right-10 glass p-4 rounded-2xl shadow-xl w-48 animate-float">
                    <div className="text-xs font-bold text-primary mb-2">HOTEL BOOKED</div>
                    <div className="text-sm font-bold truncate">Grand Resort Paris</div>
                    <div className="flex mt-2">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-accent fill-accent" />)}
                    </div>
                  </div>
                  <div className="absolute bottom-10 -left-10 glass p-4 rounded-2xl shadow-xl w-52 animate-float [animation-delay:1.5s]">
                    <div className="text-xs font-bold text-secondary mb-2">LOCATION PINNED</div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-secondary" />
                      <div className="text-sm font-bold">Eiffel Tower, 10:00 AM</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-extrabold text-text-main mb-6">Built for the modern traveler</h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto italic">Everything you need to organize your journey, all in one premium interface.</p>
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="card-premium p-8 group"
              >
                <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-text-main mb-4">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits / Social Proof */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="glass p-12 rounded-[3rem] border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -m-32" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-grade reliability</h2>
                <p className="text-text-muted text-lg max-w-md">We use the same technology powering top logistics firms to ensure your trip is perfectly optimized.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale group hover:grayscale-0 transition-all duration-500">
                <div className="text-2xl font-black">AIRBNB</div>
                <div className="text-2xl font-black">EXPEDIA</div>
                <div className="text-2xl font-black">TRIPADVISOR</div>
                <div className="text-2xl font-black">BOOKING</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { name: "Sarah Jenkins", role: "Digital Nomad", text: "Finally, a travel tool that feels like it belongs in 2024. The AI itinerary was spot on and saved me hours.", color: "bg-primary/10" },
              { name: "Michael Chen", role: "Frequent Flyer", text: "The route optimization is real. I saw more of Tokyo in 3 days than I did in a week last time.", color: "bg-secondary/10" },
              { name: "Elena Rodriguez", role: "Adventure Blogger", text: "Clean, fast, and beautiful. It's the Notion of travel planning. I recommend it to all my readers.", color: "bg-accent/10" },
            ].map((t, i) => (
              <motion.div
                key={i}
                className={`card-premium p-10 ${t.color} border-none`}
                whileHover={{ y: -10 }}
              >
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-accent fill-accent" />)}
                </div>
                <p className="text-lg font-medium text-text-main mb-8 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm" />
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-xs text-text-muted uppercase tracking-widest">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative glass-dark p-16 md:p-24 rounded-[3.5rem] overflow-hidden text-center text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] -ml-32 -mb-32" />

            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight italic">Your next story <br /> starts here.</h2>
              <p className="text-white/60 text-xl mb-12 max-w-xl mx-auto">Join 10,000+ travelers planning their dream trips today.</p>
              <Link to="/register" className="btn-primary py-5 px-12 text-xl hover:scale-105 inline-flex">
                Create My Itinerary
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <Globe className="w-6 h-6 text-primary" />
                <span className="text-2xl font-bold text-text-main uppercase tracking-tighter">TravelPlanner</span>
              </div>
              <p className="text-text-muted max-w-sm leading-relaxed mb-6">
                Reimagining travel planning through artificial intelligence. Built for explorers who value their time.
              </p>
              <div className="flex gap-4">
                {['T', 'I', 'F', 'L'].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer border border-gray-100 font-bold">
                    {i}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-text-main">Product</h4>
              <ul className="space-y-4">
                <li><a href="#" className="nav-link text-sm">Features</a></li>
                <li><a href="#" className="nav-link text-sm">Dashboard</a></li>
                <li><a href="#" className="nav-link text-sm">Enterprise</a></li>
                <li><a href="#" className="nav-link text-sm">Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-text-main">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="nav-link text-sm">About Us</a></li>
                <li><a href="#" className="nav-link text-sm">Blog</a></li>
                <li><a href="#" className="nav-link text-sm">Contact</a></li>
                <li><a href="#" className="nav-link text-sm">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
            <p>© 2024 TravelPlanner AI. Built with precision for the modern explorer.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-primary">Privacy</a>
              <a href="#" className="hover:text-primary">Terms</a>
              <a href="#" className="hover:text-primary">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

