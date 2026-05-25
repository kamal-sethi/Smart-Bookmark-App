'use client'

import { ExternalLink, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { type Bookmark } from '@/lib/types'

interface BookmarkCardProps {
  bookmark: Bookmark
  onEdit: (bookmark: Bookmark) => void
  onDelete: (id: string) => void
}

export function BookmarkCard({ bookmark, onEdit, onDelete }: BookmarkCardProps) {
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return domain.replace('www.', '')
    } catch {
      return 'Link'
    }
  }

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-200 flex flex-col h-full bg-card border border-border/50">
      {/* Header with favicon area */}
      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {bookmark.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {getDomain(bookmark.url)}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center">
            <ExternalLink className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {bookmark.description}
        </p>
        
        {/* Category Badge */}
        <div className="mt-auto mb-4">
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
            {bookmark.category}
          </span>
        </div>
      </div>

      {/* Footer with actions */}
      <div className="px-3 py-3 sm:px-4 border-t border-border/50 bg-muted/30 flex items-center gap-1.5 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
        <Button
          onClick={() => window.open(bookmark.url, '_blank')}
          variant="ghost"
          size="sm"
          className="flex-1 gap-1.5 sm:gap-2 h-9 sm:h-8 text-xs"
          title="Open link"
        >
          <ExternalLink className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">Open</span>
        </Button>
        <Button
          onClick={() => onEdit(bookmark)}
          variant="ghost"
          size="sm"
          className="h-9 w-9 sm:h-8 sm:w-8 p-0"
          title="Edit bookmark"
        >
          <Edit2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
        </Button>
        <Button
          onClick={() => onDelete(bookmark.id)}
          variant="ghost"
          size="sm"
          className="h-9 w-9 sm:h-8 sm:w-8 p-0 text-destructive hover:text-destructive"
          title="Delete bookmark"
        >
          <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
        </Button>
      </div>
    </Card>
  )
}
