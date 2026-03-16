'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Trophy, ArrowRight } from 'lucide-react'
import type { Tournament } from '@/types'

interface TournamentsListProps {
  tournaments: Tournament[]
}

const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  registration_open: 'bg-green-500/20 text-green-400 border-green-500/50',
  ongoing: 'bg-red-500/20 text-red-400 border-red-500/50 status-live',
  completed: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
}

export function TournamentsList({ tournaments }: TournamentsListProps) {
  if (tournaments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <Trophy className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No tournaments found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tournaments.map((tournament, index) => (
        <motion.div
          key={tournament.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <Link href={`/tournaments/${tournament.id}`}>
            <Card className="glass-card overflow-hidden card-hover cursor-pointer h-full group">
              {/* Banner */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-blue-600/40 group-hover:opacity-75 transition-opacity" />
                {tournament.banner_url ? (
                  <Image
                    src={tournament.banner_url}
                    alt={tournament.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                    <Trophy className="w-16 h-16 text-white/20" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge variant="outline" className={statusColors[tournament.status] || statusColors.upcoming}>
                    {tournament.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                    {tournament.game_title}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                  {tournament.name}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {tournament.description || 'No description available'}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : 'TBA'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {tournament.registered_teams || 0}/{tournament.max_teams || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-muted-foreground">Prize Pool</p>
                    <p className="text-lg font-bold text-cyan-400 font-gaming">
                      ${tournament.prize_pool ? tournament.prize_pool.toLocaleString() : '0'}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="group/btn text-purple-400 hover:text-purple-300">
                    Details
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
