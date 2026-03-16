'use client'

import { motion } from 'framer-motion'
import { Trophy, Users, Target, Zap, Crown } from 'lucide-react'

interface DashboardStatsProps {
  stats: {
    totalTournaments: number
    activeTournaments: number
    teams: number
    wins: number
    points: number
    rank: string
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const items = [
    { icon: Trophy, label: 'Total Tournaments', value: stats.totalTournaments, color: 'from-purple-500 to-pink-500' },
    { icon: Zap, label: 'Active Tournaments', value: stats.activeTournaments, color: 'from-blue-500 to-cyan-500' },
    { icon: Users, label: 'Teams', value: stats.teams, color: 'from-green-500 to-emerald-500' },
    { icon: Target, label: 'Total Wins', value: stats.wins, color: 'from-amber-500 to-orange-500' },
    { icon: Crown, label: 'Current Rank', value: stats.rank.charAt(0).toUpperCase() + stats.rank.slice(1), color: 'from-yellow-500 to-amber-500', isText: true },
    { icon: Zap, label: 'Points', value: stats.points.toLocaleString(), color: 'from-cyan-500 to-blue-500', isText: true },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="glass-card p-4 text-center group hover:border-purple-500/30 transition-all duration-300"
        >
          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} mb-3 group-hover:scale-110 transition-transform`}>
            <item.icon className="w-5 h-5 text-white" />
          </div>
          <div className={`font-bold text-white ${item.isText ? 'text-lg' : 'text-2xl font-gaming'}`}>
            {item.value}
          </div>
          <div className="text-xs text-muted-foreground">{item.label}</div>
        </motion.div>
      ))}
    </div>
  )
}
