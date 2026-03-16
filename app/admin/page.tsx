import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/components/admin-dashboard'
import { AdminStats } from '@/components/admin-stats'
import { AdminRecentTournaments } from '@/components/admin-recent-tournaments'
import { AdminUserManagement } from '@/components/admin-user-management'

export default async function AdminPage() {
  const supabase = await createClient();
  
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    redirect('/login')
  }

  // Check if user is admin or moderator
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', authUser.id)
    .single()

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    redirect('/')
  }

  // Fetch stats
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: totalTournaments } = await supabase
    .from('tournaments')
    .select('*', { count: 'exact', head: true })

  const { count: totalTeams } = await supabase
    .from('teams')
    .select('*', { count: 'exact', head: true })

  const { count: totalMatches } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })

  // Fetch recent tournaments
  const { data: recentTournaments } = await supabase
    .from('tournaments')
    .select(`
      *,
      organizer:users(id, username, avatar_url)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch users for management
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  const stats = {
    totalUsers: totalUsers || 0,
    totalTournaments: totalTournaments || 0,
    totalTeams: totalTeams || 0,
    totalMatches: totalMatches || 0,
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin <span className="gradient-text">Panel</span>
          </h1>
          <p className="text-muted-foreground">
            Manage tournaments, users, and system settings
          </p>
        </div>

        {/* Stats Overview */}
        <AdminStats stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Quick Actions & Recent */}
          <div className="space-y-6">
            <AdminDashboard />
            <AdminRecentTournaments tournaments={recentTournaments || []} />
          </div>

          {/* Right Column - User Management */}
          <div className="lg:col-span-2">
            <AdminUserManagement users={users || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
