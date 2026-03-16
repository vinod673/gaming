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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, DollarSign, Calendar, Settings, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const gameOptions = [
  'Valorant', 'Counter-Strike 2', 'League of Legends', 'Dota 2', 
  'Rocket League', 'Apex Legends', 'Overwatch 2', 'Fortnite',
  'Call of Duty', 'FIFA 24', 'Street Fighter 6', 'Tekken 8'
]

const formatOptions = [
  { value: 'single_elimination', label: 'Single Elimination' },
  { value: 'double_elimination', label: 'Double Elimination' },
  { value: 'round_robin', label: 'Round Robin' },
  { value: 'swiss', label: 'Swiss System' },
]

const skillLevelOptions = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'pro', label: 'Professional' },
]

export default function CreateTournamentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    game_title: '',
    game_mode: '5v5',
    format: 'single_elimination',
    max_teams: 16,
    team_size: 5,
    prize_pool: 0,
    entry_fee: 0,
    start_date: '',
    end_date: '',
    registration_deadline: '',
    rules: '',
    region: 'Global',
    skill_level: 'all',
  })

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('You must be logged in')
      setLoading(false)
      return
    }

    const tournamentData = {
      ...formData,
      organizer_id: user.id,
      status: 'draft',
      min_teams: 2,
      registered_teams: 0,
      currency: 'USD',
      is_public: false,
      is_featured: false,
    }

    const { error } = await supabase.from('tournaments').insert(tournamentData)

    if (error) {
      console.error('Error creating tournament:', error)
      alert('Failed to create tournament')
      setLoading(false)
      return
    }

    alert('Tournament created successfully!')
    router.push('/admin/tournaments')
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Set up a new esports tournament with all the details
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full bg-white/5">
              <TabsTrigger value="basic" className="data-[state=active]:bg-white/10">
                <Trophy className="w-4 h-4 mr-2" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-white/10">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-white/10">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-white/10">
                <DollarSign className="w-4 h-4 mr-2" />
                Details
              </TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Tournament Information</CardTitle>
                  <CardDescription>Basic details about your tournament</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Tournament Name</Label>
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
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Describe your tournament..."
                      className="w-full min-h-[120px] rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="game_title" className="text-white">Game</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="game_mode" className="text-white">Game Mode</Label>
                    <Input
                      id="game_mode"
                      value={formData.game_mode}
                      onChange={(e) => handleChange('game_mode', e.target.value)}
                      placeholder="5v5, 3v3, Solo, etc."
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Tournament Settings</CardTitle>
                  <CardDescription>Configure tournament format and requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="format" className="text-white">Format</Label>
                    <Select value={formData.format} onValueChange={(value) => handleChange('format', value)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-strong">
                        {formatOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max_teams" className="text-white">Max Teams</Label>
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
                      <Label htmlFor="team_size" className="text-white">Team Size</Label>
                      <Input
                        id="team_size"
                        type="number"
                        value={formData.team_size}
                        onChange={(e) => handleChange('team_size', parseInt(e.target.value))}
                        className="bg-white/5 border-white/10 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skill_level" className="text-white">Skill Level</Label>
                    <Select value={formData.skill_level} onValueChange={(value) => handleChange('skill_level', value)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-strong">
                        {skillLevelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region" className="text-white">Region</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) => handleChange('region', e.target.value)}
                      placeholder="Global, NA, EU, etc."
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Schedule & Deadlines</CardTitle>
                  <CardDescription>Set tournament dates and registration deadline</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date" className="text-white">Start Date</Label>
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
                      <Label htmlFor="end_date" className="text-white">End Date</Label>
                      <Input
                        id="end_date"
                        type="datetime-local"
                        value={formData.end_date}
                        onChange={(e) => handleChange('end_date', e.target.value)}
                        className="bg-white/5 border-white/10 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registration_deadline" className="text-white">Registration Deadline</Label>
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
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Prize Pool & Rules</CardTitle>
                  <CardDescription>Financial details and tournament rules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prize_pool" className="text-white">Prize Pool ($)</Label>
                      <Input
                        id="prize_pool"
                        type="number"
                        value={formData.prize_pool}
                        onChange={(e) => handleChange('prize_pool', parseFloat(e.target.value))}
                        placeholder="10000"
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rules" className="text-white">Tournament Rules</Label>
                    <textarea
                      id="rules"
                      value={formData.rules}
                      onChange={(e) => handleChange('rules', e.target.value)}
                      placeholder="Standard tournament rules, code of conduct, etc."
                      className="w-full min-h-[200px] rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link href="/admin/tournaments">
                <Button type="button" variant="outline" className="border-white/20">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="btn-gaming" disabled={loading}>
                {loading ? 'Creating...' : 'Create Tournament'}
              </Button>
            </div>
          </Tabs>
        </form>
      </div>
    </div>
  )
}
