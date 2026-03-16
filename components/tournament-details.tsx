'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Calendar, 
  Users, 
  Trophy, 
  DollarSign, 
  Clock,
  Shield,
  Gamepad2
} from 'lucide-react'
import type { Tournament } from '@/types'

interface TournamentDetailsProps {
  tournament: Tournament
  participants: { id: string; status: string; team?: { captain?: { username: string } } }[]
}

const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  registration_open: 'bg-green-500/20 text-green-400 border-green-500/50',
  ongoing: 'bg-red-500/20 text-red-400 border-red-500/50 status-live',
  completed: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
}

export function TournamentDetails({ tournament }: TournamentDetailsProps) {
  const isRegistrationOpen = tournament.status === 'registration_open'
  const spotsLeft = tournament.max_teams - tournament.registered_teams
  const progressPercent = (tournament.registered_teams / tournament.max_teams) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Banner */}
      <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8 glass-card">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-blue-900/80" />
        {tournament.banner_url ? (
          <Image
            src={tournament.banner_url}
            alt={tournament.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Trophy className="w-32 h-32 text-white/10" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent">
          <Badge variant="outline" className={`mb-3 ${statusColors[tournament.status]}`}>
            {tournament.status.replace('_', ' ').toUpperCase()}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-gaming">
            {tournament.name}
          </h1>
          <p className="text-muted-foreground line-clamp-2">{tournament.description}</p>
        </div>
      </div>

      {/* Key Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Gamepad2 className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <p className="text-sm text-muted-foreground">Game</p>
            <p className="font-bold text-white">{tournament.game_title}</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <p className="text-sm text-muted-foreground">Teams</p>
            <p className="font-bold text-white">
              {tournament.registered_teams}/{tournament.max_teams}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <p className="text-sm text-muted-foreground">Prize Pool</p>
            <p className="font-bold text-cyan-400 font-gaming">
              ${tournament.prize_pool.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <p className="text-sm text-muted-foreground">Start Date</p>
            <p className="font-bold text-white">
              {new Date(tournament.start_date).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Registration Card */}
          {(isRegistrationOpen || spotsLeft > 0) && (
            <Card className="glass-card border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {isRegistrationOpen ? 'Registration Open' : 'Registration Closing Soon'}
                    </h3>
                    <p className="text-muted-foreground">
                      {spotsLeft} spots remaining
                    </p>
                  </div>
                  <Button size="lg" className="btn-gaming">
                    Join Tournament
                  </Button>
                </div>
                
                {/* Progress Bar */}
                <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  />
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>{tournament.registered_teams} registered</span>
                  <span>{tournament.max_teams} max teams</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tournament Info */}
          <Card className="glass-card">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Rules & Requirements
                </h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {tournament.rules || 'No specific rules provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Format</p>
                  <p className="font-medium text-white capitalize">
                    {tournament.format.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Skill Level</p>
                  <p className="font-medium text-white capitalize">
                    {tournament.skill_level}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Region</p>
                  <p className="font-medium text-white">{tournament.region || 'Global'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Entry Fee</p>
                  <p className="font-medium text-white">
                    {tournament.entry_fee > 0 ? `$${tournament.entry_fee}` : 'Free'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-white">Schedule</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium text-white">
                      {new Date(tournament.start_date).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {tournament.end_date && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="font-medium text-white">
                        {new Date(tournament.end_date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                
                {tournament.registration_deadline && (
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Registration Deadline</p>
                      <p className="font-medium text-white">
                        {new Date(tournament.registration_deadline).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <h3 className="font-bold text-white mb-4">Organizer</h3>
              <Link href={`/users/${tournament.organizer_id}`} className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="font-bold text-white">
                    {tournament.organizer_id.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-white group-hover:text-purple-400 transition-colors">
                    Organizer
                  </p>
                  <p className="text-xs text-muted-foreground">
                    View Profile
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
