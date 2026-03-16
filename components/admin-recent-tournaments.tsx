'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Calendar, Users, ArrowRight, Edit } from 'lucide-react'
import type { Tournament } from '@/types'

interface AdminRecentTournamentsProps {
  tournaments: Tournament[]
}

const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-500/20 text-blue-400',
  registration_open: 'bg-green-500/20 text-green-400',
  ongoing: 'bg-red-500/20 text-red-400',
  completed: 'bg-gray-500/20 text-gray-400',
  draft: 'bg-yellow-500/20 text-yellow-400',
}

export function AdminRecentTournaments({ tournaments }: AdminRecentTournamentsProps) {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-purple-400" />
          Recent Tournaments
        </CardTitle>
        <Link href="/admin/tournaments">
          <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {tournaments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No tournaments yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">{tournament.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(tournament.start_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {tournament.registered_teams}/{tournament.max_teams}
                      </span>
                    </div>
                  </div>
                  <Badge className={statusColors[tournament.status] || ''}>
                    {tournament.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Prize Pool</p>
                    <p className="text-sm font-bold text-cyan-400">
                      ${tournament.prize_pool.toLocaleString()}
                    </p>
                  </div>
                  <Link href={`/admin/tournaments/${tournament.id}`}>
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
