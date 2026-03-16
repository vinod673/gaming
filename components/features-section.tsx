'use client'

import { motion } from 'framer-motion'
import { Trophy, Users, Swords, BarChart3, Shield, Zap } from 'lucide-react'

const features = [
  {
    icon: Trophy,
    title: 'Professional Tournaments',
    description: 'Compete in professionally organized tournaments with substantial prize pools and fair competition.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Users,
    title: 'Team Management',
    description: 'Create and manage your esports team, invite players, and track your team\'s performance.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Swords,
    title: 'Match Tracking',
    description: 'Real-time match updates, live brackets, and comprehensive match history tracking.',
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: BarChart3,
    title: 'Global Leaderboards',
    description: 'Climb the ranks on our global leaderboards and showcase your skills to the world.',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: Shield,
    title: 'Anti-Cheat Protection',
    description: 'Fair play guaranteed with our advanced anti-cheat systems and dedicated moderators.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Get instant notifications about tournament updates, match schedules, and results.',
    color: 'from-yellow-500 to-amber-500',
  },
]

export function FeaturesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Why Choose ArenaX?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to compete at the highest level. Built by gamers, for gamers.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-6 h-full hover:border-purple-500/30 transition-all duration-300 card-hover">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
