'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { BookmarkCard } from './bookmark-card'
import { type Bookmark } from '@/lib/types'

interface BookmarkGridProps {
  bookmarks: Bookmark[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onEdit: (bookmark: Bookmark) => void
  onDelete: (id: string) => void
}

export function BookmarkGrid({
  bookmarks,
  searchQuery,
  onSearchChange,
  onEdit,
  onDelete,
}: BookmarkGridProps) {
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 py-2 h-10 text-sm sm:text-base"
        />
      </div>

      {/* Bookmarks Grid */}
      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No bookmarks yet</h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            {searchQuery ? 'Try adjusting your search' : 'Start by adding your first bookmark'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
