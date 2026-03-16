'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Users, Trophy, ArrowRight } from 'lucide-react'
import type { Tournament } from '@/types'

interface FeaturedTournamentsProps {
  tournaments: Tournament[]
}

const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  registration_open: 'bg-green-500/20 text-green-400 border-green-500/50',
  ongoing: 'bg-red-500/20 text-red-400 border-red-500/50 status-live',
  completed: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
}

export function FeaturedTournaments({ tournaments }: FeaturedTournamentsProps) {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 border-purple-500/50 text-purple-400">
            Featured Events
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Upcoming Tournaments</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compete in the biggest esports events. Show your skills, win amazing prizes, 
            and make your mark in the competitive gaming world.
          </p>
        </motion.div>

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/tournaments/${tournament.id}`}>
                <Card className="glass-card overflow-hidden card-hover cursor-pointer h-full">
                  {/* Banner */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-blue-600/40" />
                    {tournament.banner_url ? (
                      <Image
                        src={tournament.banner_url}
                        alt={tournament.name}
                        fill
                        className="object-cover"
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
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Entry Fee</p>
                        <p className="text-sm font-medium text-white">
                          {tournament.entry_fee && tournament.entry_fee > 0 ? `$${tournament.entry_fee}` : 'Free'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/tournaments">
            <Button variant="outline" size="lg" className="group border-white/20 hover:bg-white/10">
              View All Tournaments
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
