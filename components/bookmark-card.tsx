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
  const handleOpen = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer')
  }

  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return domain.replace('www.', '')
    } catch {
      return 'Link'
    }
  }

  const getCreatedLabel = (createdAt: string | null) => {
    if (!createdAt) {
      return null
    }

    const date = new Date(createdAt)

    if (Number.isNaN(date.getTime())) {
      return null
    }

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const createdLabel = getCreatedLabel(bookmark.createdAt)

  return (
    <Card className="group relative flex h-full min-w-0 flex-col overflow-hidden border-border/60 bg-card/95 shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5 sm:hover:-translate-y-1">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_32%),linear-gradient(180deg,transparent,rgba(15,23,42,0.02))] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative border-b border-border/50 bg-gradient-to-r from-primary/8 via-primary/5 to-transparent p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="line-clamp-2 break-words text-sm font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary sm:text-base">
              {bookmark.title}
            </h3>
            <p className="mt-2 inline-flex max-w-full truncate rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur">
              {getDomain(bookmark.url)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpen}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-background/80 shadow-sm backdrop-blur transition-all duration-200 hover:scale-105 hover:border-primary/30 hover:bg-primary/10"
            title="Open link"
            aria-label={`Open ${bookmark.title}`}
          >
            <ExternalLink className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-4 sm:p-5">
        <p className="line-clamp-4 break-all text-sm leading-6 text-muted-foreground/95">
          {bookmark.url}
        </p>
        {createdLabel ? (
          <p className="mt-auto pt-5 text-xs font-medium tracking-wide text-muted-foreground/80">
            Saved {createdLabel}
          </p>
        ) : null}
      </div>

      <div className="relative flex items-center gap-2 border-t border-border/50 bg-muted/20 px-3 py-3 sm:px-4">
        <Button
          onClick={handleOpen}
          variant="ghost"
          size="sm"
          className="h-10 flex-1 gap-2 rounded-full border border-border/50 bg-background/70 px-3 text-xs font-medium shadow-sm transition-all duration-200 hover:border-primary/25 hover:bg-primary/5 hover:text-primary sm:h-9"
          title="Open link"
        >
          <ExternalLink className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">Open</span>
        </Button>
        <Button
          onClick={() => onEdit(bookmark)}
          variant="ghost"
          size="sm"
          className="h-10 w-10 shrink-0 rounded-full border border-border/50 bg-background/70 p-0 text-muted-foreground shadow-sm transition-all duration-200 hover:border-primary/25 hover:bg-primary/5 hover:text-primary sm:h-9 sm:w-9"
          title="Edit bookmark"
        >
          <Edit2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
        </Button>
        <Button
          onClick={() => onDelete(bookmark.id)}
          variant="ghost"
          size="sm"
          className="h-10 w-10 shrink-0 rounded-full border border-transparent bg-background/70 p-0 text-muted-foreground shadow-sm transition-all duration-200 hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive sm:h-9 sm:w-9"
          title="Delete bookmark"
        >
          <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
        </Button>
      </div>
    </Card>
  )
}
