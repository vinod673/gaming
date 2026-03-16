'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import type { TournamentFilters } from '@/types'

interface TournamentsFilterProps {
  games: string[]
  currentFilters: TournamentFilters
}

export function TournamentsFilter({ games, currentFilters }: TournamentsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/tournaments?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/tournaments')
  }

  const hasFilters = Object.values(currentFilters).some(v => v !== undefined && v !== '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 mb-8"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tournaments..."
            value={currentFilters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={currentFilters.status || ''}
          onValueChange={(value) => updateFilter('status', value)}
        >
          <SelectTrigger className="w-full md:w-40 bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="glass-strong">
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="registration_open">Registration Open</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Game Filter */}
        <Select
          value={currentFilters.game_title || ''}
          onValueChange={(value) => updateFilter('game', value)}
        >
          <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Game" />
          </SelectTrigger>
          <SelectContent className="glass-strong">
            {games.map((game) => (
              <SelectItem key={game} value={game}>
                {game}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Skill Level Filter */}
        <Select
          value={currentFilters.skill_level || ''}
          onValueChange={(value) => updateFilter('skill', value)}
        >
          <SelectTrigger className="w-full md:w-40 bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Skill Level" />
          </SelectTrigger>
          <SelectContent className="glass-strong">
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  )
}
