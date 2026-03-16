'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  PlusCircle, 
  Users, 
  Trophy, 
  Settings, 
  BarChart3,
  Shield,
  DollarSign,
} from 'lucide-react'

export function AdminDashboard() {
  const quickActions = [
    {
      icon: PlusCircle,
      label: 'Create Tournament',
      href: '/admin/tournaments/create-simple',
      color: 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20',
    },
    {
      icon: Users,
      label: 'Manage Users',
      href: '/admin/users',
      color: 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20',
    },
    {
      icon: Trophy,
      label: 'Update Results',
      href: '/admin/matches',
      color: 'text-green-400 bg-green-500/10 hover:bg-green-500/20',
    },
    {
      icon: Shield,
      label: 'Moderation',
      href: '/admin/moderation',
      color: 'text-red-400 bg-red-500/10 hover:bg-red-500/20',
    },
    {
      icon: DollarSign,
      label: 'Prize Pools',
      href: '/admin/finance',
      color: 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20',
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      href: '/admin/analytics',
      color: 'text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20',
    },
  ]

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={action.href}>
                <Button
                  variant="outline"
                  className={`w-full h-auto py-3 px-4 flex flex-col items-center gap-2 border-white/10 hover:border-white/20 transition-all ${action.color}`}
                >
                  <action.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
