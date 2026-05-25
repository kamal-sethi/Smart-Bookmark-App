'use client'

import { Bookmark, Plus, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  userEmail: string
  onLogout: () => void
  onAddNew: () => void
}

export function Navbar({ userEmail, onLogout, onAddNew }: NavbarProps) {
  return (
    <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-40 bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">KeenFlow</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              onClick={onAddNew}
              size="sm"
              className="gap-2 text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Bookmark</span>
              <span className="sm:hidden">Add</span>
            </Button>

            <div className="flex items-center gap-2 border-l border-border/40 pl-2 sm:pl-4">
              <div className="text-xs sm:text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-xs hidden xs:block">
                {userEmail}
              </div>
              <Button
                onClick={onLogout}
                variant="ghost"
                size="sm"
                className="p-1 h-auto"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
