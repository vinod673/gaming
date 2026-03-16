'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { 
  Gamepad2, 
  Trophy, 
  Users, 
  LayoutDashboard, 
  Menu,
  User,
  LogOut,
  Crown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import type { User as UserType } from '@/types'

interface NavigationProps {
  user: UserType | null
}

const navItems = [
  { href: '/', label: 'Home', icon: Gamepad2 },
  { href: '/tournaments', label: 'Tournaments', icon: Trophy },
  { href: '/leaderboard', label: 'Leaderboard', icon: Users },
]

export function Navigation({ user }: NavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center neon-glow">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              ArenaX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`relative px-4 py-2 transition-all duration-300 ${
                      active 
                        ? 'text-white' 
                        : 'text-muted-foreground hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Admin Link */}
                {(user.role === 'admin' || user.role === 'moderator') && (
                  <Link href="/admin" className="hidden sm:block">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                    >
                      <Crown className="w-4 h-4 mr-1" />
                      Admin
                    </Button>
                  </Link>
                )}

                {/* Dashboard Link */}
                <Link href="/dashboard" className="hidden sm:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={isActive('/dashboard') ? 'text-white' : 'text-muted-foreground'}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-1" />
                    Dashboard
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border-2 border-purple-500/50">
                      <AvatarImage src={user.avatar_url || ''} alt={user.username || 'User'} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-sm">
                        {user.username ? user.username.slice(0, 2).toUpperCase() : '??'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  </Button>
                  <DropdownMenuContent className="w-56 glass-strong" align="end">
                    <div className="flex items-center gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || ''} alt={user.username} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
                          {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-white">{user.username || 'User'}</p>
                        <p className="text-xs text-muted-foreground">{user.email || ''}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <Link href="/dashboard" className="cursor-pointer">
                      <DropdownMenuItem>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    {(user.role === 'admin' || user.role === 'moderator') && (
                      <Link href="/admin" className="cursor-pointer">
                        <DropdownMenuItem>
                          <Crown className="mr-2 h-4 w-4 text-amber-400" />
                          Admin Panel
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      className="text-red-400 focus:text-red-400 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault()
                        handleLogout()
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="btn-gaming">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <SheetContent side="right" className="glass-strong w-72">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                      >
                        <Button
                          variant={active ? 'default' : 'ghost'}
                          className={`w-full justify-start gap-3 ${
                            active ? 'btn-gaming' : ''
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </Button>
                      </Link>
                    )
                  })}
                  
                  {user && (
                    <>
                      <div className="h-px bg-white/10 my-2" />
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3">
                          <LayoutDashboard className="w-5 h-5" />
                          Dashboard
                        </Button>
                      </Link>
                      {(user.role === 'admin' || user.role === 'moderator') && (
                        <Link href="/admin" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-3 text-amber-400">
                            <Crown className="w-5 h-5" />
                            Admin Panel
                          </Button>
                        </Link>
                      )}
                    </>
                  )}
                  
                  {!user && (
                    <>
                      <div className="h-px bg-white/10 my-2" />
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3">
                          <User className="w-5 h-5" />
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full btn-gaming">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}
