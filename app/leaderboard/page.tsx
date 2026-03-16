import { createClient } from '@/lib/supabase/server'
import { LeaderboardTable } from '@/components/leaderboard-table'
import { Trophy, Crown, Medal } from 'lucide-react'
import { motion } from 'framer-motion'

export default async function LeaderboardPage() {
  const supabase = await createClient()

  // Fetch top players
  const { data: players } = await supabase
    .from('users')
    .select('*')
    .order('points', { ascending: false })
    .limit(100)

  // Fetch top teams
  const { data: teams } = await supabase
    .from('teams')
    .select(`
      *,
      captain:users(id, username, avatar_url)
    `)
    .order('points', { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Global Leaderboard</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The best players and teams competing for the top spot. Climb the ranks and make your mark in esports history.
          </p>
        </div>

        {/* Top 3 Podium */}
        {players && players.length >= 3 && (
          <div className="mb-16">
            <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8">
              {/* 2nd Place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="glass-card p-6 text-center w-48">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                    <Medal className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-white truncate">{players[1]?.username || 'Unknown'}</h3>
                  <p className="text-2xl font-bold text-gray-400 font-gaming">#{players[1]?.points || 0}</p>
                </div>
                <div className="w-32 h-24 bg-gradient-to-t from-gray-500/20 to-transparent rounded-t-lg mt-2" />
              </motion.div>

              {/* 1st Place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center -mt-8 md:mt-0"
              >
                <Crown className="w-8 h-8 text-yellow-400 mb-2" />
                <div className="glass-card p-6 text-center w-56 border-yellow-500/30">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center neon-glow">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg truncate">{players[0]?.username || 'Unknown'}</h3>
                  <p className="text-3xl font-bold text-yellow-400 font-gaming">#{players[0]?.points || 0}</p>
                </div>
                <div className="w-40 h-32 bg-gradient-to-t from-yellow-500/20 to-transparent rounded-t-lg mt-2" />
              </motion.div>

              {/* 3rd Place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="glass-card p-6 text-center w-48">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                    <Medal className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-white truncate">{players[2]?.username || 'Unknown'}</h3>
                  <p className="text-2xl font-bold text-amber-600 font-gaming">#{players[2]?.points || 0}</p>
                </div>
                <div className="w-32 h-16 bg-gradient-to-t from-amber-600/20 to-transparent rounded-t-lg mt-2" />
              </motion.div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <LeaderboardTable players={players || []} teams={teams || []} />
      </div>
    </div>
  )
}
