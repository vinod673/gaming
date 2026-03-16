'use client'

import { motion } from 'framer-motion'
import { Trophy, Users, Target, DollarSign } from 'lucide-react'

interface StatsSectionProps {
  stats: {
    tournaments: number
    users: number
    teams: number
    prizePool: number
  }
}

export function StatsSection({ stats }: StatsSectionProps) {
  const items = [
    { icon: Trophy, label: 'Total Tournaments', value: stats.tournaments, suffix: '+' },
    { icon: Users, label: 'Active Players', value: stats.users, suffix: '+' },
    { icon: Target, label: 'Teams Competing', value: stats.teams, suffix: '+' },
    { icon: DollarSign, label: 'Prize Pool', value: `$${(stats.prizePool / 1000000).toFixed(1)}M`, suffix: '' },
  ]

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 text-center group hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-4 group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-colors">
                <item.icon className="w-6 h-6 text-purple-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white font-gaming mb-1">
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                {item.suffix}
              </div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
