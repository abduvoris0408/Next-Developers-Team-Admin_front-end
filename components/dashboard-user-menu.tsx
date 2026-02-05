'use client'

import { LogOut, User, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function DashboardUserMenu() {
  const { user, logout, token } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  // Show placeholder while user data is loading but token exists
  if (!user && token) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-lg">
        <div className="h-8 w-8 bg-slate-700 rounded-full animate-pulse" />
        <div className="flex-1 min-w-0 space-y-1">
          <div className="h-3 bg-slate-700 rounded animate-pulse w-20" />
          <div className="h-2 bg-slate-700 rounded animate-pulse w-16" />
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar?.url || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="bg-cyan-500 text-white">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user.role}</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
        <DropdownMenuItem onClick={() => router.push('/dashboard/profile')} className="cursor-pointer">
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="cursor-pointer">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
