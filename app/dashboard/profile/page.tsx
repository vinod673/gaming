'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Trophy, Crown, Edit2, Save, X, Upload, LogOut } from 'lucide-react'
import type { User as UserType } from '@/types'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar_url: '',
    bio: '',
  })

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profile) {
        setUser(profile)
        setFormData({
          username: profile.username || '',
          email: profile.email || '',
          avatar_url: profile.avatar_url || '',
          bio: profile.bio || '',
        })
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('users')
        .update({
          username: formData.username,
          avatar_url: formData.avatar_url,
          bio: formData.bio,
        })
        .eq('id', user?.id)

      if (error) throw error

      // Update local state
      setUser(prev => prev ? { ...prev, ...formData } : null)
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      avatar_url: user?.avatar_url || '',
      bio: user?.bio || '',
    })
    setEditing(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="glass-strong border-white/10 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Public Profile</CardTitle>
                <CardDescription>Your public profile information</CardDescription>
              </div>
              {!editing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(true)}
                  className="border-white/20 hover:bg-white/5"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="border-white/20 hover:bg-white/5"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-gaming"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24 border-2 border-purple-500/50">
                <AvatarImage src={formData.avatar_url} alt={formData.username} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-2xl">
                  {formData.username ? formData.username.slice(0, 2).toUpperCase() : '??'}
                </AvatarFallback>
              </Avatar>
              {editing && (
                <div className="flex-1">
                  <Label htmlFor="avatar_url" className="text-white">Avatar URL</Label>
                  <Input
                    id="avatar_url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              )}
            </div>

            <Separator className="bg-white/10" />

            {/* Username */}
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-white flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </Label>
              {editing ? (
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              ) : (
                <p className="text-white text-lg">{user.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <p className="text-white text-lg">{user.email}</p>
              <p className="text-sm text-muted-foreground">Email cannot be changed</p>
            </div>

            {/* Bio */}
            <div className="grid gap-2">
              <Label htmlFor="bio" className="text-white">Bio</Label>
              {editing ? (
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              ) : (
                <p className="text-white">{user.bio || 'No bio added'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="glass-strong border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Gaming Stats
            </CardTitle>
            <CardDescription>Your tournament statistics and rankings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Wins</p>
                <p className="text-2xl font-bold text-white">{user.total_wins || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Points</p>
                <p className="text-2xl font-bold text-white">{user.points || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Rank Tier</p>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                  {user.rank_tier || 'Unranked'}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge variant="outline" className={`${
                  user.role === 'admin' 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : user.role === 'moderator'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : 'bg-green-500/10 text-green-400 border-green-500/20'
                }`}>
                  {user.role === 'admin' ? (
                    <>
                      <Crown className="w-3 h-3 mr-1" />
                      Admin
                    </>
                  ) : user.role === 'moderator' ? (
                    <>
                      <Crown className="w-3 h-3 mr-1" />
                      Moderator
                    </>
                  ) : (
                    'Player'
                  )}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
