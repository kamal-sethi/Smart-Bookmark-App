'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type Bookmark, type BookmarkFormValues } from '@/lib/types'

interface AddBookmarkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (bookmark: BookmarkFormValues) => Promise<void>
  initialBookmark?: Bookmark | null
  isSaving?: boolean
}

export function AddBookmarkModal({
  open,
  onOpenChange,
  onSave,
  initialBookmark,
  isSaving = false,
}: AddBookmarkModalProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState('')

  useEffect(() => {
    if (initialBookmark) {
      setTitle(initialBookmark.title)
      setUrl(initialBookmark.url)
    } else {
      setTitle('')
      setUrl('')
    }
    setUrlError('')
  }, [initialBookmark, open])

  const validateUrl = (urlString: string) => {
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

  const normalizeUrl = (urlString: string) => {
    const trimmedUrl = urlString.trim()

    if (/^https?:\/\//i.test(trimmedUrl)) {
      return trimmedUrl
    }

    return `https://${trimmedUrl}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const normalizedUrl = normalizeUrl(url)

    if (!validateUrl(normalizedUrl)) {
      setUrlError('Please enter a valid URL (e.g., example.com or https://example.com)')
      return
    }

    await onSave({
      title: title.trim(),
      url: normalizedUrl,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[min(95vw,28rem)] overflow-y-auto rounded-2xl px-4 py-5 sm:max-h-[90vh] sm:px-6 sm:py-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {initialBookmark ? 'Edit Bookmark' : 'Add New Bookmark'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {initialBookmark 
              ? 'Update the details of your bookmark'
              : 'Save a new link to your collection'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="React Documentation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSaving}
                className="h-11"
              />
            </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="text"
              inputMode="url"
              placeholder="react.dev or https://react.dev"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setUrlError('')
              }}
              required
              disabled={isSaving}
              className={`h-11 ${urlError ? 'border-destructive' : ''}`}
            />
            {urlError && (
              <p className="text-xs text-destructive">{urlError}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:gap-3 sm:pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="h-11 flex-1 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="h-11 flex-1 text-sm"
            >
              {isSaving
                ? (initialBookmark ? 'Updating...' : 'Saving...') 
                : (initialBookmark ? 'Update' : 'Save')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
