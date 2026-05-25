'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { BookmarkCard } from './bookmark-card'
import { type Bookmark } from '@/lib/types'

interface BookmarkGridProps {
  bookmarks: Bookmark[]
  searchQuery: string
  hasMore: boolean
  isLoadingMore: boolean
  onSearchChange: (query: string) => void
  onLoadMore: () => void
  onEdit: (bookmark: Bookmark) => void
  onDelete: (id: string) => void
}

export function BookmarkGrid({
  bookmarks,
  searchQuery,
  hasMore,
  isLoadingMore,
  onSearchChange,
  onLoadMore,
  onEdit,
  onDelete,
}: BookmarkGridProps) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:left-4 sm:h-5 sm:w-5" />
        <Input
          type="text"
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 rounded-xl border-border/60 bg-background/80 py-2 pl-10 text-sm shadow-sm sm:pl-12 sm:text-base"
        />
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/15 px-4 py-14 text-center sm:py-16">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 sm:h-16 sm:w-16">
            <svg className="h-6 w-6 text-muted-foreground sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
            </svg>
          </div>
          <h3 className="mb-2 text-base font-semibold text-foreground sm:text-lg">No bookmarks yet</h3>
          <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
            {searchQuery ? 'Try adjusting your search' : 'Start by saving your first bookmark'}
          </p>
        </div>
      ) : (
        <div className="space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>

          {hasMore ? (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className="h-11 min-w-36 gap-2 rounded-full px-5 text-sm shadow-sm"
              >
                {isLoadingMore ? <Spinner className="size-4" /> : null}
                {isLoadingMore ? 'Loading more...' : 'Load More'}
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
