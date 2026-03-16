'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Clock } from 'lucide-react'

interface DashboardActivityProps {
  matches: { id: string; status: string; tournament?: { name: string }; team1?: { tag: string }; team2?: { tag: string }; team1_score?: number; team2_score?: number; scheduled_time?: string | null }[]
}

const statusColors: Record<string, string> = {
  scheduled: 'text-blue-400',
  live: 'text-red-400 animate-pulse',
  completed: 'text-green-400',
}

export function DashboardActivity({ matches }: DashboardActivityProps) {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <div className="text-center py-6">
            <Clock className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No recent matches</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-white/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">
                    {match.tournament?.name || 'Unknown Tournament'}
                  </span>
                  <span className={`text-xs font-medium ${statusColors[match.status] || 'text-white'}`}>
                    {match.status || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white text-sm">
                      {match.team1?.tag || 'Team 1'}
                    </span>
                    <span className="text-muted-foreground">vs</span>
                    <span className="font-medium text-white text-sm">
                      {match.team2?.tag || 'Team 2'}
                    </span>
                  </div>
                  {match.status === 'completed' && (
                    <span className="text-sm font-bold text-white">
                      {match.team1_score ?? 0} - {match.team2_score ?? 0}
                    </span>
                  )}
                </div>
                {match.scheduled_time && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(match.scheduled_time).toLocaleString()}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
