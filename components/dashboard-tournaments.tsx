'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Calendar, ArrowRight } from 'lucide-react'

interface DashboardTournamentsProps {
  participations: { id: string; tournament?: { name: string; status: string; start_date: string } }[]
}

const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-500/20 text-blue-400',
  registration_open: 'bg-green-500/20 text-green-400',
  ongoing: 'bg-red-500/20 text-red-400',
  completed: 'bg-gray-500/20 text-gray-400',
}

export function DashboardTournaments({ participations }: DashboardTournamentsProps) {
  const activeTournaments = participations.filter(
    p => p.tournament?.status === 'ongoing' || p.tournament?.status === 'registration_open'
  )

  const pastTournaments = participations.filter(
    p => p.tournament?.status === 'completed'
  )

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-purple-400" />
          My Tournaments
        </CardTitle>
        <Link href="/tournaments">
          <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
            Browse All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {participations.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No tournaments yet</p>
            <Link href="/tournaments">
              <Button variant="link" className="text-purple-400">
                Find a tournament
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Active Tournaments */}
            {activeTournaments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Active</h4>
                <div className="space-y-3">
                  {activeTournaments.slice(0, 3).map((participation, index) => (
                    <motion.div
                      key={participation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{participation.tournament?.name || 'Unknown Tournament'}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {participation.tournament?.start_date ? new Date(participation.tournament.start_date).toLocaleDateString() : 'TBA'}
                          </div>
                        </div>
                      </div>
                      <Badge className={participation.tournament?.status ? statusColors[participation.tournament.status] : ''}>
                        {participation.tournament?.status ? participation.tournament.status.replace('_', ' ') : 'Unknown'}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Tournaments */}
            {pastTournaments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Completed</h4>
                <div className="space-y-3">
                  {pastTournaments.slice(0, 2).map((participation, index) => (
                    <motion.div
                      key={participation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 opacity-70"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-500/30 to-gray-600/30 flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{participation.tournament?.name || 'Completed Tournament'}</p>
                          <p className="text-xs text-muted-foreground">Completed</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
