import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardStats } from '@/components/dashboard-stats'
import { DashboardTournaments } from '@/components/dashboard-tournaments'
import { DashboardTeams } from '@/components/dashboard-teams'
import { DashboardActivity } from '@/components/dashboard-activity'

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's teams
  const { data: teamMemberships } = await supabase
    .from('team_members')
    .select(`
      *,
      team:teams(*)
    `)
    .eq('user_id', user.id)

  // Fetch user's tournament participations
  const { data: participations } = await supabase
    .from('tournament_participants')
    .select(`
      *,
      tournament:tournaments(*)
    `)
    .eq('user_id', user.id)
    .order('registration_date', { ascending: false })

  // Fetch recent matches
  const { data: recentMatches } = await supabase
    .from('matches')
    .select(`
      *,
      tournament:tournaments(name),
      team1:teams!matches_team1_id_fkey(name, tag),
      team2:teams!matches_team2_id_fkey(name, tag)
    `)
    .or(`team1_id.in.(${teamMemberships?.map(tm => tm.team_id).join(',')}),team2_id.in.(${teamMemberships?.map(tm => tm.team_id).join(',')})`)
    .order('scheduled_time', { ascending: false })
    .limit(5)

  const stats = {
    totalTournaments: participations?.length || 0,
    activeTournaments: participations?.filter(p => 
      p.tournament?.status === 'ongoing' || p.tournament?.status === 'registration_open'
    ).length || 0,
    teams: teamMemberships?.length || 0,
    wins: user.total_wins,
    points: user.points,
    rank: user.rank_tier,
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="gradient-text">{user.username}</span>
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your tournaments and teams.
          </p>
        </div>

        {/* Stats Overview */}
        <DashboardStats stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Tournaments */}
          <div className="lg:col-span-2">
            <DashboardTournaments participations={participations || []} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <DashboardTeams memberships={teamMemberships || []} />
            <DashboardActivity matches={recentMatches || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
