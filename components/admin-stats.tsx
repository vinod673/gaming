'use client'

import { motion } from 'framer-motion'
import { Users, Trophy, Target, Activity, TrendingUp } from 'lucide-react'

interface AdminStatsProps {
  stats: {
    totalUsers: number
    totalTournaments: number
    totalTeams: number
    totalMatches: number
  }
}

export function AdminStats({ stats }: AdminStatsProps) {
  const items = [
    { 
      icon: Users, 
      label: 'Total Users', 
      value: stats.totalUsers, 
      color: 'from-purple-500 to-pink-500',
      trend: '+12%'
    },
    { 
      icon: Trophy, 
      label: 'Tournaments', 
      value: stats.totalTournaments, 
      color: 'from-blue-500 to-cyan-500',
      trend: '+5'
    },
    { 
      icon: Target, 
      label: 'Active Teams', 
      value: stats.totalTeams, 
      color: 'from-green-500 to-emerald-500',
      trend: '+8'
    },
    { 
      icon: Activity, 
      label: 'Total Matches', 
      value: stats.totalMatches, 
      color: 'from-amber-500 to-orange-500',
      trend: '+24'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="glass-card p-6 group hover:border-purple-500/30 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} group-hover:scale-110 transition-transform`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-green-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {item.trend}
            </span>
          </div>
          <div className="text-3xl font-bold text-white font-gaming mb-1">
            {item.value.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">{item.label}</div>
        </motion.div>
      ))}
    </div>
  )
}
