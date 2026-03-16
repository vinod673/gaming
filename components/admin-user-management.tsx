'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Users, Search, MoreVertical, Edit, Ban, Check, Shield, Crown } from 'lucide-react'
import type { User } from '@/types'

interface AdminUserManagementProps {
  users: User[]
}

const roleColors: Record<string, string> = {
  player: 'bg-blue-500/20 text-blue-400',
  moderator: 'bg-purple-500/20 text-purple-400',
  admin: 'bg-amber-500/20 text-amber-400',
}

export function AdminUserManagement({ users }: AdminUserManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string | null>('all')

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    
    return matchesSearch && matchesRole
  })

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent className="glass-strong">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="player">Player</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-muted-foreground font-medium">User</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Email</th>
                <th className="text-center p-4 text-muted-foreground font-medium">Role</th>
                <th className="text-center p-4 text-muted-foreground font-medium">Stats</th>
                <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-purple-500/30">
                        <AvatarImage src={user.avatar_url || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-sm">
                          {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{user.username}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">{user.email}</td>
                  <td className="p-4 text-center">
                    <Badge className={roleColors[user.role] || roleColors.player}>
                      {user.role === 'admin' && <Crown className="w-3 h-3 mr-1" />}
                      {user.role === 'moderator' && <Shield className="w-3 h-3 mr-1" />}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-3 text-xs">
                      <span className="text-green-400">{user.total_wins}W</span>
                      <span className="text-red-400">{user.total_losses}L</span>
                      <span className="text-cyan-400">{user.points} pts</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white" onClick={(e) => e.currentTarget.closest('button')?.click()}>
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      <DropdownMenuContent className="glass-strong" align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Check className="w-4 h-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem className="text-red-400 focus:text-red-400">
                          <Ban className="w-4 h-4 mr-2" />
                          Suspend User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <p className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="border-white/10">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="border-white/10">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
