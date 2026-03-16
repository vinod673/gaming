'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Users } from 'lucide-react'
import type { User, Team } from '@/types'

interface LeaderboardTableProps {
  players: User[]
  teams: Team[]
}

const rankColors: Record<number, string> = {
  1: 'text-yellow-400',
  2: 'text-gray-400',
  3: 'text-amber-600',
}

export function LeaderboardTable({ players, teams }: LeaderboardTableProps) {
  const [activeTab, setActiveTab] = useState('players')

  return (
    <div className="glass-card overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 bg-white/5 p-1 rounded-none">
          <TabsTrigger value="players" className="data-[state=active]:bg-white/10">
            <Users className="w-4 h-4 mr-2" />
            Players
          </TabsTrigger>
          <TabsTrigger value="teams" className="data-[state=active]:bg-white/10">
            <Trophy className="w-4 h-4 mr-2" />
            Teams
          </TabsTrigger>
        </TabsList>

        <TabsContent value="players" className="m-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-muted-foreground font-medium">Rank</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Player</th>
                  <th className="text-center p-4 text-muted-foreground font-medium">Wins</th>
                  <th className="text-center p-4 text-muted-foreground font-medium">Kills</th>
                  <th className="text-center p-4 text-muted-foreground font-medium">K/D</th>
                  <th className="text-right p-4 text-muted-foreground font-medium">Points</th>
                </tr>
              </thead>
              <tbody>
                {players.slice(3).map((player, index) => {
                  const rank = index + 4
                  const kd = player.total_deaths > 0 
                    ? (player.total_kills / player.total_deaths).toFixed(2) 
                    : player.total_kills.toFixed(2)

                  return (
                    <motion.tr
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <span className={`font-bold font-gaming text-lg ${rankColors[rank] || 'text-white'}`}>
                          #{rank}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border-2 border-purple-500/30">
                            <AvatarImage src={player.avatar_url || ''} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-sm">
                              {player.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-white">{player.username}</p>
                            <Badge variant="outline" className="text-xs capitalize">
                              {player.rank_tier}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center text-white">{player.total_wins}</td>
                      <td className="p-4 text-center text-white">{player.total_kills}</td>
                      <td className="p-4 text-center">
                        <span className={`font-medium ${Number(kd) >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                          {kd}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-xl font-bold text-cyan-400 font-gaming">
                          {player.points.toLocaleString()}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="m-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-muted-foreground font-medium">Rank</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Team</th>
                  <th className="text-center p-4 text-muted-foreground font-medium">Wins</th>
                  <th className="text-center p-4 text-muted-foreground font-medium">Losses</th>
                  <th className="text-center p-4 text-muted-foreground font-medium">Win Rate</th>
                  <th className="text-right p-4 text-muted-foreground font-medium">Points</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team: Team & { captain?: { username: string } }, index) => {
                  const rank = index + 1
                  const totalMatches = team.total_wins + team.total_losses
                  const winRate = totalMatches > 0 
                    ? ((team.total_wins / totalMatches) * 100).toFixed(1) 
                    : '0.0'

                  return (
                    <motion.tr
                      key={team.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <span className={`font-bold font-gaming text-lg ${rankColors[rank] || 'text-white'}`}>
                          #{rank}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center border border-white/10">
                            <span className="font-bold text-white text-sm">{team.tag}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-white">{team.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Captain: {team.captain?.username || 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center text-green-400">{team.total_wins}</td>
                      <td className="p-4 text-center text-red-400">{team.total_losses}</td>
                      <td className="p-4 text-center">
                        <span className="font-medium text-white">{winRate}%</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-xl font-bold text-cyan-400 font-gaming">
                          {team.points.toLocaleString()}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
