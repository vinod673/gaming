'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trophy, DollarSign, Calendar, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const gameOptions = [
  'Valorant', 'Counter-Strike 2', 'League of Legends', 'Dota 2', 
  'Rocket League', 'Apex Legends', 'Overwatch 2', 'Fortnite',
  'Call of Duty', 'FIFA 24', 'Street Fighter 6', 'Tekken 8'
]

export default function CreateTournamentSimple() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    game_title: '',
    max_teams: 16,
    team_size: 5,
    prize_pool: 0,
    entry_fee: 0,
    start_date: '',
    registration_deadline: '',
  })

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('You must be logged in')
      setLoading(false)
      return
    }

    const tournamentData = {
      ...formData,
      organizer_id: user.id,
      status: 'registration_open',
      format: 'single_elimination',
      game_mode: `${formData.team_size}v${formData.team_size}`,
      min_teams: 2,
      registered_teams: 0,
      currency: 'USD',
      is_public: true,
      is_featured: false,
      skill_level: 'all',
      region: 'Global',
      rules: 'Standard tournament rules apply. Fair play expected from all participants.',
    }

    const { error } = await supabase.from('tournaments').insert(tournamentData)

    if (error) {
      console.error('Error:', error)
      alert('Failed to create tournament')
      setLoading(false)
      return
    }

    alert('✅ Tournament created successfully!')
    router.push('/admin')
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            Create <span className="gradient-text">Tournament</span>
          </h1>
          <p className="text-muted-foreground">
            Quick setup - takes less than 2 minutes
          </p>
        </div>

        {/* Simple Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Info */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                Tournament Name & Game
              </CardTitle>
              <CardDescription>What are you hosting?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Tournament Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Summer Championship 2024"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description *</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Tell players about your tournament..."
                  className="w-full min-h-[100px] rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="game_title" className="text-white">Game *</Label>
                <Select value={formData.game_title} onValueChange={(value) => handleChange('game_title', value)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent className="glass-strong">
                    {gameOptions.map((game) => (
                      <SelectItem key={game} value={game}>{game}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Teams & Players
              </CardTitle>
              <CardDescription>How many participants?</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_teams" className="text-white">Max Teams *</Label>
                <Input
                  id="max_teams"
                  type="number"
                  value={formData.max_teams}
                  onChange={(e) => handleChange('max_teams', parseInt(e.target.value))}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team_size" className="text-white">Players per Team *</Label>
                <Input
                  id="team_size"
                  type="number"
                  value={formData.team_size}
                  onChange={(e) => handleChange('team_size', parseInt(e.target.value))}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-400" />
                Schedule
              </CardTitle>
              <CardDescription>When does it happen?</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 space-y-0">
              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-white">Start Date *</Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => handleChange('start_date', e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration_deadline" className="text-white">Registration Ends *</Label>
                <Input
                  id="registration_deadline"
                  type="datetime-local"
                  value={formData.registration_deadline}
                  onChange={(e) => handleChange('registration_deadline', e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Prize & Entry Fee */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                Prize & Entry Fee
              </CardTitle>
              <CardDescription>Optional financial details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 space-y-0">
              <div className="space-y-2">
                <Label htmlFor="prize_pool" className="text-white">Prize Pool ($)</Label>
                <Input
                  id="prize_pool"
                  type="number"
                  value={formData.prize_pool}
                  onChange={(e) => handleChange('prize_pool', parseFloat(e.target.value))}
                  placeholder="0"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry_fee" className="text-white">Entry Fee ($)</Label>
                <Input
                  id="entry_fee"
                  type="number"
                  value={formData.entry_fee}
                  onChange={(e) => handleChange('entry_fee', parseFloat(e.target.value))}
                  placeholder="0 for free"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Link href="/admin" className="flex-1">
              <Button type="button" variant="outline" className="w-full border-white/20">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="flex-1 btn-gaming" disabled={loading}>
              {loading ? 'Creating...' : '🚀 Create Tournament'}
            </Button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-8 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <p className="text-sm text-purple-200">
            💡 <strong>Tip:</strong> All tournaments are set to Single Elimination format by default. 
            You can change this and add more details after creation.
          </p>
        </div>
      </div>
    </div>
  )
}
