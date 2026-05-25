'use client'

import { Bookmark, LogOut, Plus } from 'lucide-react'
import { type User } from '@supabase/supabase-js'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  getUserAvatarUrl,
  getUserDisplayName,
  getUserInitials,
} from '@/lib/supabase/auth'

interface NavbarProps {
  user: User
  onLogout: () => void
  onAddNew: () => void
  isSigningOut?: boolean
}

export function Navbar({ user, onLogout, onAddNew, isSigningOut = false }: NavbarProps) {
  const displayName = getUserDisplayName(user)
  const avatarUrl = getUserAvatarUrl(user)
  const initials = getUserInitials(user)

  return (
    <nav className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-3 py-2">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
              <Bookmark className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="truncate text-base font-semibold text-foreground sm:text-lg">
              KeenFlow
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Button
              onClick={onAddNew}
              size="sm"
              className="h-10 gap-2 px-3 text-xs sm:px-4 sm:text-sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">Add Bookmark</span>
              <span className="md:hidden">Add</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-10 items-center gap-2 rounded-full border border-border/60 pl-1.5 pr-1.5 transition-colors hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-ring sm:pl-2 sm:pr-1"
                  aria-label="Open profile menu"
                >
                  <div className="hidden max-w-[140px] text-right lg:block">
                    <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
                  </div>
                  <Avatar className="h-9 w-9 border border-border/60">
                    {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-[min(16rem,calc(100vw-1rem))]">
                <DropdownMenuLabel className="space-y-1">
                  <p className="truncate font-medium text-foreground">{displayName}</p>
                  <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onLogout}
                  variant="destructive"
                  disabled={isSigningOut}
                  className="cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  {isSigningOut ? 'Logging out...' : 'Logout'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
