'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Plus, Crown } from 'lucide-react'

interface DashboardTeamsProps {
  memberships: { id: string; role: string; team?: { tag: string; name: string } }[]
}

export function DashboardTeams({ memberships }: DashboardTeamsProps) {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          My Teams
        </CardTitle>
        <Link href="/teams/create">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-400 hover:text-purple-300">
            <Plus className="w-4 h-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {memberships.length === 0 ? (
          <div className="text-center py-6">
            <Users className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground mb-3">No teams yet</p>
            <Link href="/teams/create">
              <Button size="sm" variant="outline" className="border-white/20">
                Create Team
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {memberships.map((membership, index) => (
              <motion.div
                key={membership.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center border border-white/10">
                  <span className="font-bold text-white text-sm">
                    {membership.team?.tag || 'N/A'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{membership.team?.name || 'Unknown Team'}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground capitalize">
                      {membership.role}
                    </span>
                    {membership.role === 'captain' && (
                      <Crown className="w-3 h-3 text-yellow-400" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
