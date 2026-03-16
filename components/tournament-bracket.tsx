'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Clock } from 'lucide-react'

interface TournamentBracketProps {
  matches: { id: string; round: number; match_number: number; team1_id?: string; team2_id?: string; team1_score?: number; team2_score?: number; winner_id?: string | null; scheduled_time?: string | null; status: string; team1?: { tag: string; name?: string }; team2?: { tag: string; name?: string }; winner?: { name: string } }[]
  format: string
}

export function TournamentBracket({ matches, format }: TournamentBracketProps) {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)
  
  // Group matches by round
  const rounds = matches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = []
    }
    acc[match.round].push(match)
    return acc
  }, {} as Record<number, { id: string; round: number; match_number: number; team1_id?: string; team2_id?: string; team1_score?: number; team2_score?: number; winner_id?: string | null; scheduled_time?: string | null; status: string; team1?: { tag: string; name?: string }; team2?: { tag: string; name?: string }; winner?: { name: string } }[]>)

  const roundNames: Record<number, string> = {
    1: 'Round 1',
    2: 'Round 2',
    3: 'Quarterfinals',
    4: 'Semifinals',
    5: 'Finals',
  }

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-purple-400" />
            Tournament Bracket
          </h2>
          <Badge variant="outline" className="border-white/20 capitalize">
            {format.replace('_', ' ')}
          </Badge>
        </div>

        {/* Bracket Visualization */}
        <div className="overflow-x-auto">
          <div className="flex gap-8 min-w-max pb-4">
            {Object.entries(rounds).map(([round, matchesInRound], index) => (
              <motion.div
                key={round}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col gap-4"
              >
                <div className="text-center mb-2">
                  <h3 className="font-bold text-white">
                    {roundNames[Number(round)] || `Round ${round}`}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {matchesInRound.length} match{matchesInRound.length !== 1 ? 'es' : ''}
                  </p>
                </div>

                <div className="space-y-3">
                  {matchesInRound.map((match: { id: string; round: number; match_number: number; team1_id?: string; team2_id?: string; team1_score?: number; team2_score?: number; winner_id?: string | null; scheduled_time?: string | null; status: string; team1?: { tag: string; name?: string }; team2?: { tag: string; name?: string }; winner?: { name: string } }, matchIndex: number) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: matchIndex * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedMatchId(selectedMatchId === match.id ? null : match.id)}
                      className="cursor-pointer"
                    >
                      <Card className={`glass-card transition-all duration-300 ${
                        selectedMatchId === match.id ? 'border-purple-500/50 shadow-lg shadow-purple-500/20' : 'border-white/10'
                      }`}>
                        <CardContent className="p-3 w-48">
                          {/* Team 1 */}
                          <div className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center border border-white/10">
                                <span className="text-xs font-bold text-white">
                                  {match.team1?.tag || 'TBD'}
                                </span>
                              </div>
                              <span className={`text-sm font-medium ${
                                match.winner_id === match.team1_id 
                                  ? 'text-green-400 font-bold' 
                                  : 'text-white'
                              }`}>
                                {match.team1?.name || 'TBD'}
                              </span>
                            </div>
                            {match.team1_score !== undefined && match.status === 'completed' && (
                              <span className={`text-sm font-bold ${
                                match.winner_id === match.team1_id 
                                  ? 'text-green-400' 
                                  : 'text-muted-foreground'
                              }`}>
                                {match.team1_score}
                              </span>
                            )}
                          </div>

                          {/* VS Divider */}
                          {match.status === 'live' && (
                            <div className="flex items-center justify-center py-1">
                              <Badge className="status-live text-xs">LIVE</Badge>
                            </div>
                          )}

                          {/* Team 2 */}
                          <div className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center border border-white/10">
                                <span className="text-xs font-bold text-white">
                                  {match.team2?.tag || 'TBD'}
                                </span>
                              </div>
                              <span className={`text-sm font-medium ${
                                match.winner_id === match.team2_id 
                                  ? 'text-green-400 font-bold' 
                                  : 'text-white'
                              }`}>
                                {match.team2?.name || 'TBD'}
                              </span>
                            </div>
                            {match.team2_score !== undefined && match.status === 'completed' && (
                              <span className={`text-sm font-bold ${
                                match.winner_id === match.team2_id 
                                  ? 'text-green-400' 
                                  : 'text-muted-foreground'
                              }`}>
                                {match.team2_score}
                              </span>
                            )}
                          </div>

                          {/* Match Info */}
                          {match.scheduled_time && match.status === 'scheduled' && (
                            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-white/10">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {new Date(match.scheduled_time).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Connection Lines (Visual only) */}
        <div className="relative hidden lg:block">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* SVG lines would be drawn here based on bracket structure */}
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
