'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'

interface TournamentParticipantsProps {
  participants: { id: string; status: string; team?: { tag: string; name: string; captain?: { username: string } }; user?: { username: string; avatar_url?: string | null } }[]
  teamSize: number
}

export function TournamentParticipants({ participants, teamSize }: TournamentParticipantsProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Participants ({participants.length}/{teamSize === 1 ? 'Solo' : 'Teams'})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {participants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No participants yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participants.map((participant: { id: string; status: string; team?: { tag: string; name: string; captain?: { username: string } }; user?: { username: string; avatar_url?: string | null } }, index: number) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Seed Number */}
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center border border-white/10">
                    <span className="font-bold text-white text-sm">#{index + 1}</span>
                  </div>

                  {/* Team or Player Info */}
                  {participant.team ? (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center border border-white/10">
                          <span className="font-bold text-white text-xs">
                            {participant.team.tag}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">
                            {participant.team.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Captain: {participant.team.captain?.username || 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-purple-500/30">
                        <AvatarImage src={participant.user?.avatar_url || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-sm">
                          {participant.user?.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">
                          {participant.user?.username}
                        </p>
                        <Badge variant="outline" className="text-xs capitalize">
                          {participant.status}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <Badge 
                    variant="outline" 
                    className={`
                      ${participant.status === 'approved' ? 'bg-green-500/20 text-green-400 border-green-500/50' : ''}
                      ${participant.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : ''}
                      ${participant.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-500/50' : ''}
                    `}
                  >
                    {participant.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
