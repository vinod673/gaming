import { createClient } from '@/lib/supabase/server'
import { TournamentsList } from '@/components/tournaments-list'
import { TournamentsFilter } from '@/components/tournaments-filter'
import type { TournamentFilters, TournamentStatus, SkillLevel } from '@/types'

interface TournamentsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function TournamentsPage({ searchParams }: TournamentsPageProps) {
  const supabase = await createClient()
  
  // Build filters
  const resolvedSearchParams = await searchParams
  const filters: TournamentFilters = {
    status: resolvedSearchParams.status as TournamentStatus | undefined,
    game_title: resolvedSearchParams.game as string | undefined,
    skill_level: resolvedSearchParams.skill as SkillLevel | undefined,
    search: resolvedSearchParams.search as string | undefined,
  }

  // Build query
  let query = supabase
    .from('tournaments')
    .select(`
      *,
      organizer:users(id, username, avatar_url)
    `)
    .eq('is_public', true)

  // Apply filters
  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.game_title) {
    query = query.eq('game_title', filters.game_title)
  }
  if (filters.skill_level) {
    query = query.eq('skill_level', filters.skill_level)
  }
  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  // Fetch tournaments
  const { data: tournaments, error } = await query
    .order('start_date', { ascending: true })

  // Fetch unique games for filter
  const { data: games } = await supabase
    .from('tournaments')
    .select('game_title')
    .eq('is_public', true)

  const uniqueGames = Array.from(new Set(games?.map(g => g.game_title) || []))

  if (error) {
    console.error('Error fetching tournaments:', error)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Tournaments</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse and join competitive esports tournaments. Find the perfect competition for your skill level.
          </p>
        </div>

        {/* Filters */}
        <TournamentsFilter games={uniqueGames} currentFilters={filters} />

        {/* Tournaments List */}
        <TournamentsList tournaments={tournaments || []} />
      </div>
    </div>
  )
}
