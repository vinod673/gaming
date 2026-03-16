import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TournamentDetails } from '@/components/tournament-details'
import { TournamentBracket } from '@/components/tournament-bracket'
import { TournamentParticipants } from '@/components/tournament-participants'

interface TournamentPageProps {
  params: Promise<{ id: string }>
}

export default async function TournamentPage({ params }: TournamentPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  // Fetch tournament details
  const { data: tournament, error } = await supabase
    .from('tournaments')
    .select(`
      *,
      organizer:users(id, username, avatar_url)
    `)
    .eq('id', id)
    .single()

  if (error || !tournament) {
    notFound()
  }

  // Fetch participants
  const { data: participants } = await supabase
    .from('tournament_participants')
    .select(`
      *,
      team:teams(*),
      user:users(id, username, avatar_url)
    `)
    .eq('tournament_id', id)
    .order('seed_number', { ascending: true })

  // Fetch matches
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      team1:teams!matches_team1_id_fkey(name, tag, logo_url),
      team2:teams!matches_team2_id_fkey(name, tag, logo_url),
      winner:teams(name, tag)
    `)
    .eq('tournament_id', id)
    .order('round', { ascending: true })
    .order('match_number', { ascending: true })

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TournamentDetails 
          tournament={tournament} 
          participants={participants || []}
        />
        
        {/* Tabs for Bracket and Participants */}
        <div className="mt-8 space-y-8">
          {matches && matches.length > 0 && (
            <TournamentBracket matches={matches} format={tournament.format} />
          )}
          
          <TournamentParticipants 
            participants={participants || []} 
            teamSize={tournament.team_size}
          />
        </div>
      </div>
    </div>
  )
}
